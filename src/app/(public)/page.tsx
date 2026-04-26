import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { buildGeneralWhatsAppUrl, normalizeWaNumber } from '@/lib/whatsapp';
import type { ProdukWithRelations } from '@/lib/types';

export const revalidate = 60; // ISR — revalidate setiap 60 detik

export default async function HomePage() {
  const supabase = createClient();

  const [pengaturanRes, featuredRes, kategoriRes, terbaruRes] = await Promise.all([
    supabase.from('pengaturan_toko').select('*').eq('id', 1).maybeSingle(),
    supabase
      .from('produk')
      .select('*, kategori:kategori_id(*), foto_produk(*)')
      .eq('is_aktif', true)
      .eq('is_featured', true)
      .order('updated_at', { ascending: false })
      .limit(8),
    supabase.from('kategori').select('*').order('urutan', { ascending: true }).limit(8),
    supabase
      .from('produk')
      .select('*, kategori:kategori_id(*), foto_produk(*)')
      .eq('is_aktif', true)
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const pengaturan = pengaturanRes.data;
  const featured = (featuredRes.data || []) as ProdukWithRelations[];
  const kategori = kategoriRes.data || [];
  const terbaru = (terbaruRes.data || []) as ProdukWithRelations[];
  const produkUnggulan = featured.length > 0 ? featured : terbaru.slice(0, 4);

  const waUrl = pengaturan?.nomor_wa
    ? buildGeneralWhatsAppUrl(pengaturan.nomor_wa, pengaturan.nama_toko || 'Dzawata Trophy')
    : '#';

  return (
    <>
      <HeroSection pengaturan={pengaturan} />

      {/* Kategori */}
      {kategori.length > 0 && (
        <section className="py-16 md:py-20 bg-cream">
          <div className="container-page">
            <div className="text-center mb-10 md:mb-14">
              <p className="ornamental-rule justify-center mb-4">Jelajahi</p>
              <h2 className="heading-section">Kategori Produk</h2>
              <p className="mt-3 text-ink-muted max-w-xl mx-auto">
                Pilih jenis produk sesuai kebutuhan acara atau penghargaan Anda
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {kategori.map(k => (
                <Link
                  key={k.id}
                  href={`/katalog?kategori=${k.slug}`}
                  className="group relative overflow-hidden bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 md:p-7 text-center hover:-translate-y-1"
                >
                  {/* Gold ornament */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-3xl md:text-4xl mb-2 text-gold-500">🏆</div>
                  <h3 className="font-display font-semibold text-base md:text-lg text-navy-700 group-hover:text-navy-600">
                    {k.nama}
                  </h3>
                  <p className="mt-1 text-xs text-ink-subtle">Lihat semua →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produk Unggulan */}
      {produkUnggulan.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="container-page">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8 md:mb-12">
              <div>
                <p className="ornamental-rule mb-3">Pilihan Terbaik</p>
                <h2 className="heading-section">Produk Unggulan</h2>
              </div>
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 text-navy-600 hover:text-navy-700 font-medium text-sm group"
              >
                Lihat Semua
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {produkUnggulan.slice(0, 8).map((p, i) => (
                <ProductCard key={p.id} produk={p} priority={i < 4} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tentang singkat & Kontak */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-navy-700 to-navy-900 text-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="ornamental-rule text-gold-400 mb-4">Tentang Kami</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold !text-white">
                Dipercaya untuk Setiap Pencapaian
              </h2>
              <p className="mt-5 text-navy-100 text-base md:text-lg leading-relaxed">
                {pengaturan?.deskripsi ||
                  'Kami adalah pengrajin profesional yang berpengalaman dalam pembuatan piala, plakat, medali, dan trofi berkualitas. Setiap produk dikerjakan dengan teliti untuk menghadirkan kebanggaan di setiap pencapaian.'}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/tentang" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-navy-800 transition-all duration-200">
                  Pelajari Lebih Lanjut
                </Link>
                {normalizeWaNumber(pengaturan?.nomor_wa || '') && (
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/></svg>
                    Hubungi via WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                ['100+', 'Desain Tersedia'],
                ['1000+', 'Pesanan Selesai'],
                ['7+', 'Tahun Pengalaman'],
                ['100%', 'Kepuasan Klien'],
              ].map(([num, label]) => (
                <div key={label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 md:p-6 text-center">
                  <div className="font-display text-3xl md:text-4xl font-bold text-gold-400">{num}</div>
                  <div className="mt-1 text-xs md:text-sm text-navy-200 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}