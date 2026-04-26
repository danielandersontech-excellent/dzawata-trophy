import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import { formatRupiah } from '@/lib/utils';
import { buildWhatsAppUrl, normalizeWaNumber } from '@/lib/whatsapp';
import type { Metadata } from 'next';
import type { ProdukWithRelations } from '@/lib/types';

export const revalidate = 30;

type Params = { slug: string };

async function getProduk(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from('produk')
    .select('*, kategori:kategori_id(*), foto_produk(*)')
    .eq('slug', slug)
    .eq('is_aktif', true)
    .maybeSingle();
  return data as ProdukWithRelations | null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const produk = await getProduk(params.slug);
  if (!produk) return { title: 'Produk Tidak Ditemukan' };
  const fotoUtama = produk.foto_produk?.[0]?.url;
  return {
    title: produk.nama,
    description: produk.deskripsi?.slice(0, 160) || `${produk.nama} — pesan langsung melalui WhatsApp.`,
    openGraph: {
      title: produk.nama,
      description: produk.deskripsi?.slice(0, 160) || undefined,
      images: fotoUtama ? [{ url: fotoUtama }] : undefined,
    },
  };
}

export default async function DetailProdukPage({ params }: { params: Params }) {
  const produk = await getProduk(params.slug);
  if (!produk) notFound();

  const supabase = createClient();
  const [{ data: pengaturan }, { data: relatedRaw }] = await Promise.all([
    supabase.from('pengaturan_toko').select('*').eq('id', 1).maybeSingle(),
    produk.kategori_id
      ? supabase
          .from('produk')
          .select('*, kategori:kategori_id(*), foto_produk(*)')
          .eq('is_aktif', true)
          .eq('kategori_id', produk.kategori_id)
          .neq('id', produk.id)
          .order('created_at', { ascending: false })
          .limit(4)
      : Promise.resolve({ data: [] }),
  ]);
  const related = (relatedRaw || []) as ProdukWithRelations[];

  // Build WhatsApp link dengan auto-fill berdasarkan template di pengaturan
  const waUrl = pengaturan?.nomor_wa
    ? buildWhatsAppUrl({
        nomorWa: pengaturan.nomor_wa,
        template: pengaturan.pesan_wa_default,
        variables: {
          nama_produk: produk.nama,
          kategori: produk.kategori?.nama || '',
          harga: formatRupiah(produk.harga_mulai),
          nama_toko: pengaturan.nama_toko || 'Dzawata Trophy',
        },
      })
    : '#';
  const waOk = !!normalizeWaNumber(pengaturan?.nomor_wa || '');

  // Sort foto by urutan
  const fotos = [...produk.foto_produk].sort((a, b) => a.urutan - b.urutan);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-page py-3 text-sm">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap text-ink-subtle">
            <Link href="/" className="hover:text-navy-600">Beranda</Link>
            <span>/</span>
            <Link href="/katalog" className="hover:text-navy-600">Katalog</Link>
            {produk.kategori && (
              <>
                <span>/</span>
                <Link href={`/katalog?kategori=${produk.kategori.slug}`} className="hover:text-navy-600">
                  {produk.kategori.nama}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-ink truncate max-w-[200px]">{produk.nama}</span>
          </nav>
        </div>
      </div>

      <section className="container-page py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery */}
          <ProductGallery fotos={fotos} altBase={produk.nama} />

          {/* Info */}
          <div>
            {produk.kategori && (
              <Link href={`/katalog?kategori=${produk.kategori.slug}`} className="badge-gold inline-block">
                {produk.kategori.nama}
              </Link>
            )}
            <h1 className="mt-3 font-display text-3xl md:text-4xl lg:text-5xl font-bold text-navy-700 leading-tight">
              {produk.nama}
            </h1>

            <div className="mt-5 pb-5 border-b border-gray-200">
              <p className="text-xs uppercase tracking-wider text-ink-subtle">
                {produk.harga_mulai > 0 ? 'Harga Mulai' : 'Harga'}
              </p>
              <p className="mt-1 font-display font-bold text-3xl md:text-4xl text-gold-600">
                {formatRupiah(produk.harga_mulai)}
              </p>
              {produk.harga_mulai > 0 && (
                <p className="mt-1 text-xs text-ink-subtle">
                  Harga dapat berubah tergantung ukuran, bahan, dan finishing
                </p>
              )}
            </div>

            {produk.deskripsi && (
              <div className="mt-5">
                <h2 className="font-display text-xl font-semibold text-navy-700 mb-2">Deskripsi</h2>
                <div className="prose-trophy whitespace-pre-line">{produk.deskripsi}</div>
              </div>
            )}

            {/* CTA WhatsApp */}
            <div className="mt-7 sticky bottom-0 bg-white pb-2 -mx-4 px-4 lg:static lg:mx-0 lg:px-0">
              {waOk ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full !py-4 !text-base"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.713.307 1.27.49 1.704.628.716.227 1.366.195 1.882.118.574-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/>
                  </svg>
                  Pesan via WhatsApp
                </a>
              ) : (
                <p className="text-sm text-ink-muted bg-cream rounded-lg p-4">
                  Nomor WhatsApp belum diatur. Silakan kontak admin.
                </p>
              )}
              <p className="mt-3 text-xs text-ink-subtle text-center">
                💬 Pesan otomatis terkirim dengan informasi produk yang Anda pilih
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-2 pt-5 border-t border-gray-200 text-center">
              <div className="text-xs">
                <div className="text-gold-500 text-lg">✦</div>
                <div className="mt-1 text-ink-muted">Custom Desain</div>
              </div>
              <div className="text-xs">
                <div className="text-gold-500 text-lg">⚡</div>
                <div className="mt-1 text-ink-muted">Pengerjaan Cepat</div>
              </div>
              <div className="text-xs">
                <div className="text-gold-500 text-lg">★</div>
                <div className="mt-1 text-ink-muted">Kualitas Premium</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produk terkait */}
      {related.length > 0 && (
        <section className="bg-cream py-12 md:py-16 mt-8">
          <div className="container-page">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-navy-700 mb-6 md:mb-8">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} produk={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
