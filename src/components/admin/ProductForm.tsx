'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';
import { createProduk, updateProduk, deleteFoto } from '@/app/admin/actions';
import type { Kategori, ProdukWithRelations } from '@/lib/types';

type Props = {
  kategori: Kategori[];
  produk?: ProdukWithRelations;
};

export default function ProductForm({ kategori, produk }: Props) {
  const router = useRouter();
  const isEdit = !!produk;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = isEdit
        ? await updateProduk(produk!.id, formData)
        : await createProduk(formData);
      if (res?.error) setError(res.error);
    });
  };

  const handleRemoveExisting = async (fotoId: string) => {
    if (!produk) return;
    const res = await deleteFoto(fotoId, produk.id);
    if (res?.error) {
      alert('Gagal menghapus foto: ' + res.error);
    } else {
      router.refresh();
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-card p-5 md:p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-navy-700">Informasi Produk</h2>

        <div>
          <label htmlFor="nama" className="label">
            Nama Produk <span className="text-rose-500">*</span>
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            required
            defaultValue={produk?.nama || ''}
            placeholder="Contoh: Piala Akrilik Kategori Juara"
            className="input"
            disabled={isPending}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="kategori_id" className="label">Kategori</label>
            <select
              id="kategori_id"
              name="kategori_id"
              defaultValue={produk?.kategori_id || ''}
              className="input"
              disabled={isPending}
            >
              <option value="">— Pilih kategori —</option>
              {kategori.map(k => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
            {kategori.length === 0 && (
              <p className="mt-1 text-xs text-rose-600">
                Belum ada kategori. <Link href="/admin/kategori" className="underline">Tambahkan kategori dulu →</Link>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="harga_mulai" className="label">Harga Mulai (Rp)</label>
            <input
              id="harga_mulai"
              name="harga_mulai"
              type="number"
              min="0"
              step="1000"
              defaultValue={produk?.harga_mulai ?? 0}
              placeholder="0 = Hubungi Kami"
              className="input"
              disabled={isPending}
            />
            <p className="mt-1 text-xs text-ink-subtle">
              Isi 0 jika ingin tampil "Hubungi Kami"
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="deskripsi" className="label">Deskripsi</label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            rows={5}
            defaultValue={produk?.deskripsi || ''}
            placeholder="Bahan akrilik tebal 5mm, ukuran 25cm. Cocok untuk perlombaan tingkat sekolah…"
            className="input resize-y"
            disabled={isPending}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <label className="flex items-center gap-3 cursor-pointer p-3 border-2 rounded-lg has-[:checked]:border-emerald-300 has-[:checked]:bg-emerald-50/50 transition-all">
            <input
              type="checkbox"
              name="is_aktif"
              defaultChecked={produk ? produk.is_aktif : true}
              className="w-4 h-4 accent-emerald-600"
              disabled={isPending}
            />
            <div>
              <p className="font-medium text-ink text-sm">Aktif</p>
              <p className="text-xs text-ink-subtle">Tampil di website publik</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer p-3 border-2 rounded-lg has-[:checked]:border-gold-300 has-[:checked]:bg-gold-50/50 transition-all">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={produk?.is_featured || false}
              className="w-4 h-4 accent-gold-600"
              disabled={isPending}
            />
            <div>
              <p className="font-medium text-ink text-sm">Unggulan</p>
              <p className="text-xs text-ink-subtle">Tampil di beranda</p>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-5 md:p-6">
        <h2 className="font-display text-lg font-semibold text-navy-700 mb-4">Foto Produk</h2>
        <ImageUploader
          existing={produk?.foto_produk?.map(f => ({ id: f.id, url: f.url })) || []}
          onRemoveExisting={isEdit ? handleRemoveExisting : undefined}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3 pt-2">
        <Link href="/admin/produk" className="btn-outline" aria-disabled={isPending}>
          Batal
        </Link>
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? 'Menyimpan…' : (isEdit ? 'Simpan Perubahan' : 'Tambah Produk')}
        </button>
      </div>
    </form>
  );
}
