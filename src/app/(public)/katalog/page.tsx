import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import SortSelect from '@/components/SortSelect';
import type { Metadata } from 'next';
import type { ProdukWithRelations } from '@/lib/types';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Katalog Produk',
  description: 'Lihat koleksi piala, plakat, medali, dan trofi berkualitas yang kami sediakan.',
};

type SP = { kategori?: string; q?: string; sort?: string };

export default async function KatalogPage({ searchParams }: { searchParams: SP }) {
  const supabase = createClient();
  const kategoriSlug = searchParams.kategori;
  const q = (searchParams.q || '').trim();
  const sort = searchParams.sort || 'terbaru';

  // Ambil daftar kategori
  const { data: kategori } = await supabase
    .from('kategori')
    .select('*')
    .order('urutan', { ascending: true });

  // Cari id kategori berdasarkan slug
  let kategoriId: string | null = null;
  let kategoriAktif = null;
  if (kategoriSlug) {
    kategoriAktif = kategori?.find(k => k.slug === kategoriSlug);
    kategoriId = kategoriAktif?.id || null;
  }

  // Build query produk
  let query = supabase
    .from('produk')
    .select('*, kategori:kategori_id(*), foto_produk(*)')
    .eq('is_aktif', true);

  if (kategoriId) query = query.eq('kategori_id', kategoriId);
  if (q) query = query.or(`nama.ilike.%${q}%,deskripsi.ilike.%${q}%`);

  // Sorting
  if (sort === 'harga-asc') query = query.order('harga_mulai', { ascending: true });
  else if (sort === 'harga-desc') query = query.order('harga_mulai', { ascending: false });
  else if (sort === 'nama') query = query.order('nama', { ascending: true });
  else query = query.order('created_at', { ascending: false });

  const { data: produkList } = await query;
  const produk = (produkList || []) as ProdukWithRelations[];

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-12 md:py-16">
        <div className="container-page">
          <p className="ornamental-rule text-gold-400 mb-3">Koleksi Lengkap</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold !text-white">Katalog Produk</h1>
          <p className="mt-3 text-navy-100 max-w-2xl">
            Temukan piala, plakat, medali, dan trofi yang sesuai untuk acara Anda.
          </p>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-20">
        <div className="container-page py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <SearchBar placeholder="Cari nama produk…" />
            <SortSelect current={sort} />
          </div>

          {kategori && kategori.length > 0 && (
            <div className="mt-4">
              <CategoryFilter kategori={kategori} current={kategoriSlug} />
            </div>
          )}
        </div>
      </section>

      {/* Produk grid */}
      <section className="container-page py-10 md:py-12">
        {produk.length > 0 ? (
          <>
            <p className="text-sm text-ink-muted mb-5">
              Menampilkan <strong className="text-ink">{produk.length}</strong> produk
              {kategoriAktif && <> di kategori <strong className="text-ink">{kategoriAktif.nama}</strong></>}
              {q && <> dengan kata kunci "<strong className="text-ink">{q}</strong>"</>}
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {produk.map((p, i) => (
                <ProductCard key={p.id} produk={p} priority={i < 4} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 md:py-24">
            <div className="text-6xl mb-4 opacity-50">🏆</div>
            <h2 className="font-display text-2xl text-navy-700">Belum ada produk yang cocok</h2>
            <p className="mt-2 text-ink-muted">
              {q || kategoriSlug
                ? 'Coba ubah filter atau kata kunci pencarian.'
                : 'Produk akan segera ditambahkan oleh admin.'}
            </p>
            {(q || kategoriSlug) && (
              <Link href="/katalog" className="btn-outline mt-6">
                Reset Filter
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
}
