import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import type { Metadata } from 'next';
import type { ProdukWithRelations } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Edit Produk',
  robots: { index: false, follow: false },
};

export default async function EditProdukPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const [{ data: produk }, { data: kategori }] = await Promise.all([
    supabase
      .from('produk')
      .select('*, kategori:kategori_id(*), foto_produk(*)')
      .eq('id', params.id)
      .maybeSingle(),
    supabase
      .from('kategori')
      .select('*')
      .order('urutan', { ascending: true }),
  ]);

  if (!produk) notFound();

  const produkSorted = {
    ...produk,
    foto_produk: [...(produk.foto_produk || [])].sort((a, b) => a.urutan - b.urutan),
  } as ProdukWithRelations;

  return (
    <div className="space-y-5 md:space-y-6 max-w-4xl">
      <nav aria-label="breadcrumb" className="text-sm text-ink-subtle">
        <Link href="/admin/produk" className="hover:text-navy-600">← Daftar Produk</Link>
      </nav>

      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-navy-700">Edit Produk</h1>
          <p className="text-ink-muted text-sm mt-1 truncate">{produk.nama}</p>
        </div>
        <Link
          href={`/katalog/${produk.slug}`}
          target="_blank"
          className="text-sm text-navy-600 hover:text-navy-700 font-medium inline-flex items-center gap-1"
        >
          Lihat di website
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </Link>
      </header>

      <ProductForm kategori={kategori || []} produk={produkSorted} />
    </div>
  );
}
