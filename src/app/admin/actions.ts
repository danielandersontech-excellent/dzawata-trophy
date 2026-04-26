'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { slugify, uniqueSlug } from '@/lib/utils';

// =====================================================
// AUTH
// =====================================================

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const redirectTo = String(formData.get('redirect') || '/admin');

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Email atau password salah.' };
  }

  redirect(redirectTo);
}

export async function logoutAction() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

// =====================================================
// PRODUK
// =====================================================

async function ensureAuth() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return { supabase, user };
}

async function getNextSlug(table: 'produk' | 'kategori', nama: string, ignoreId?: string) {
  const { supabase } = await ensureAuth();
  let query = supabase.from(table).select('slug');
  if (ignoreId) query = query.neq('id', ignoreId);
  const { data } = await query;
  const existing = (data || []).map(d => d.slug as string);
  return uniqueSlug(nama, existing);
}

async function uploadFotoToStorage(file: File, produkId: string) {
  const { supabase } = await ensureAuth();
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
  const fileName = `${produkId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

  const buffer = await file.arrayBuffer();
  const { error: uploadErr } = await supabase.storage
    .from('produk-foto')
    .upload(fileName, buffer, {
      contentType: file.type || `image/${safeExt}`,
      upsert: false,
    });

  if (uploadErr) throw new Error(uploadErr.message);

  const { data: urlData } = supabase.storage.from('produk-foto').getPublicUrl(fileName);
  return { url: urlData.publicUrl, path: fileName };
}

export async function createProduk(formData: FormData) {
  const { supabase } = await ensureAuth();

  const nama = String(formData.get('nama') || '').trim();
  const deskripsi = String(formData.get('deskripsi') || '').trim();
  const hargaMulai = Number(formData.get('harga_mulai') || 0);
  const kategoriId = String(formData.get('kategori_id') || '');
  const isAktif = formData.get('is_aktif') === 'on' || formData.get('is_aktif') === 'true';
  const isFeatured = formData.get('is_featured') === 'on' || formData.get('is_featured') === 'true';

  if (!nama) return { error: 'Nama produk wajib diisi.' };

  const slug = await getNextSlug('produk', nama);

  const { data: produk, error } = await supabase
    .from('produk')
    .insert({
      nama,
      slug,
      deskripsi: deskripsi || null,
      harga_mulai: isFinite(hargaMulai) ? Math.max(0, Math.floor(hargaMulai)) : 0,
      kategori_id: kategoriId || null,
      is_aktif: isAktif,
      is_featured: isFeatured,
    })
    .select()
    .single();

  if (error || !produk) {
    return { error: error?.message || 'Gagal menyimpan produk.' };
  }

  // Upload foto-foto
  const files = formData.getAll('foto').filter(f => f instanceof File && (f as File).size > 0) as File[];

  for (let i = 0; i < files.length && i < 5; i++) {
    const file = files[i];
    if (file.size > 5 * 1024 * 1024) continue; // skip > 5MB
    try {
      const { url, path } = await uploadFotoToStorage(file, produk.id);
      await supabase.from('foto_produk').insert({
        produk_id: produk.id,
        url,
        storage_path: path,
        urutan: i,
      });
    } catch (e) {
      console.error('Upload foto gagal:', e);
    }
  }

  revalidatePath('/admin/produk');
  revalidatePath('/');
  revalidatePath('/katalog');
  redirect('/admin/produk');
}

export async function updateProduk(id: string, formData: FormData) {
  const { supabase } = await ensureAuth();

  const nama = String(formData.get('nama') || '').trim();
  const deskripsi = String(formData.get('deskripsi') || '').trim();
  const hargaMulai = Number(formData.get('harga_mulai') || 0);
  const kategoriId = String(formData.get('kategori_id') || '');
  const isAktif = formData.get('is_aktif') === 'on' || formData.get('is_aktif') === 'true';
  const isFeatured = formData.get('is_featured') === 'on' || formData.get('is_featured') === 'true';

  if (!nama) return { error: 'Nama produk wajib diisi.' };

  // Cek apakah nama berubah → regenerate slug
  const { data: existing } = await supabase.from('produk').select('nama, slug').eq('id', id).maybeSingle();
  let slug = existing?.slug;
  if (!existing || existing.nama !== nama) {
    slug = await getNextSlug('produk', nama, id);
  }

  const { error } = await supabase
    .from('produk')
    .update({
      nama,
      slug,
      deskripsi: deskripsi || null,
      harga_mulai: isFinite(hargaMulai) ? Math.max(0, Math.floor(hargaMulai)) : 0,
      kategori_id: kategoriId || null,
      is_aktif: isAktif,
      is_featured: isFeatured,
    })
    .eq('id', id);

  if (error) return { error: error.message };

  // Upload foto baru (append)
  const files = formData.getAll('foto').filter(f => f instanceof File && (f as File).size > 0) as File[];
  if (files.length > 0) {
    // Hitung urutan saat ini
    const { count } = await supabase
      .from('foto_produk')
      .select('*', { count: 'exact', head: true })
      .eq('produk_id', id);
    const startUrutan = count || 0;

    for (let i = 0; i < files.length && (startUrutan + i) < 5; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) continue;
      try {
        const { url, path } = await uploadFotoToStorage(file, id);
        await supabase.from('foto_produk').insert({
          produk_id: id,
          url,
          storage_path: path,
          urutan: startUrutan + i,
        });
      } catch (e) {
        console.error('Upload foto gagal:', e);
      }
    }
  }

  revalidatePath('/admin/produk');
  revalidatePath(`/admin/produk/${id}/edit`);
  revalidatePath('/');
  revalidatePath('/katalog');
  revalidatePath(`/katalog/${slug}`);
  redirect('/admin/produk');
}

export async function deleteProduk(id: string) {
  const { supabase } = await ensureAuth();

  // Hapus foto dari storage
  const { data: fotos } = await supabase
    .from('foto_produk')
    .select('storage_path')
    .eq('produk_id', id);

  const paths = (fotos || []).map(f => f.storage_path).filter(Boolean) as string[];
  if (paths.length > 0) {
    await supabase.storage.from('produk-foto').remove(paths);
  }

  // foto_produk akan otomatis terhapus karena ON DELETE CASCADE
  const { error } = await supabase.from('produk').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/produk');
  revalidatePath('/');
  revalidatePath('/katalog');
  return { success: true };
}

export async function toggleProdukAktif(id: string, current: boolean) {
  const { supabase } = await ensureAuth();
  const { error } = await supabase
    .from('produk')
    .update({ is_aktif: !current })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/produk');
  revalidatePath('/');
  revalidatePath('/katalog');
  return { success: true };
}

export async function toggleProdukFeatured(id: string, current: boolean) {
  const { supabase } = await ensureAuth();
  const { error } = await supabase
    .from('produk')
    .update({ is_featured: !current })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/produk');
  revalidatePath('/');
  return { success: true };
}

export async function deleteFoto(fotoId: string, produkId: string) {
  const { supabase } = await ensureAuth();

  // Ambil storage_path
  const { data: foto } = await supabase
    .from('foto_produk')
    .select('storage_path')
    .eq('id', fotoId)
    .maybeSingle();

  if (foto?.storage_path) {
    await supabase.storage.from('produk-foto').remove([foto.storage_path]);
  }

  const { error } = await supabase.from('foto_produk').delete().eq('id', fotoId);
  if (error) return { error: error.message };

  revalidatePath(`/admin/produk/${produkId}/edit`);
  revalidatePath('/');
  revalidatePath('/katalog');
  return { success: true };
}

// =====================================================
// KATEGORI
// =====================================================

export async function createKategori(formData: FormData) {
  const { supabase } = await ensureAuth();

  const nama = String(formData.get('nama') || '').trim();
  const urutan = Number(formData.get('urutan') || 0);

  if (!nama) return { error: 'Nama kategori wajib diisi.' };

  const slug = await getNextSlug('kategori', nama);

  const { error } = await supabase.from('kategori').insert({
    nama,
    slug,
    urutan: isFinite(urutan) ? Math.floor(urutan) : 0,
  });

  if (error) return { error: error.message };

  revalidatePath('/admin/kategori');
  revalidatePath('/');
  revalidatePath('/katalog');
  return { success: true };
}

export async function updateKategori(id: string, formData: FormData) {
  const { supabase } = await ensureAuth();

  const nama = String(formData.get('nama') || '').trim();
  const urutan = Number(formData.get('urutan') || 0);
  if (!nama) return { error: 'Nama kategori wajib diisi.' };

  const { data: existing } = await supabase.from('kategori').select('nama, slug').eq('id', id).maybeSingle();
  let slug = existing?.slug;
  if (!existing || existing.nama !== nama) {
    slug = await getNextSlug('kategori', nama, id);
  }

  const { error } = await supabase
    .from('kategori')
    .update({ nama, slug, urutan: isFinite(urutan) ? Math.floor(urutan) : 0 })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/kategori');
  revalidatePath('/');
  revalidatePath('/katalog');
  return { success: true };
}

export async function deleteKategori(id: string) {
  const { supabase } = await ensureAuth();
  // Cek apakah masih ada produk
  const { count } = await supabase
    .from('produk')
    .select('*', { count: 'exact', head: true })
    .eq('kategori_id', id);

  if ((count || 0) > 0) {
    return { error: `Kategori masih dipakai oleh ${count} produk. Pindah produk-produk tersebut dulu.` };
  }

  const { error } = await supabase.from('kategori').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/kategori');
  revalidatePath('/');
  revalidatePath('/katalog');
  return { success: true };
}

// =====================================================
// PENGATURAN TOKO
// =====================================================

export async function updatePengaturan(formData: FormData) {
  const { supabase } = await ensureAuth();

  const update: Record<string, string | null> = {
    nama_toko: String(formData.get('nama_toko') || '').trim() || 'Dzawata Trophy',
    tagline: (String(formData.get('tagline') || '').trim() || null) as string | null,
    deskripsi: (String(formData.get('deskripsi') || '').trim() || null) as string | null,
    nomor_wa: (String(formData.get('nomor_wa') || '').trim() || null) as string | null,
    pesan_wa_default: (String(formData.get('pesan_wa_default') || '').trim() || null) as string | null,
    alamat: (String(formData.get('alamat') || '').trim() || null) as string | null,
    jam_operasional: (String(formData.get('jam_operasional') || '').trim() || null) as string | null,
    email: (String(formData.get('email') || '').trim() || null) as string | null,
    google_maps_url: (String(formData.get('google_maps_url') || '').trim() || null) as string | null,
  };

  const { error } = await supabase.from('pengaturan_toko').update(update).eq('id', 1);

  if (error) return { error: error.message };

  revalidatePath('/admin/pengaturan');
  revalidatePath('/');
  revalidatePath('/tentang');
  return { success: true };
}
