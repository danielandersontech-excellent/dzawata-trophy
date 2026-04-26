import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tambah Produk',
  robots: { index: false, follow: false },
};

export default async function TambahProdukPage() {
  const supabase = createClient();
  const { data: kategori } = await supabase
    .from('kategori')
    .select('*')
    .order('urutan', { ascending: true });

  return (
    <div className="space-y-5 md:space-y-6 max-w-4xl">
      <nav aria-label="breadcrumb" className="text-sm text-ink-subtle">
        <Link href="/admin/produk" className="hover:text-navy-600">← Daftar Produk</Link>
      </nav>

      <header>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-navy-700">Tambah Produk</h1>
        <p className="text-ink-muted text-sm mt-1">Lengkapi informasi produk dan unggah foto</p>
      </header>

      <ProductForm kategori={kategori || []} />
    </div>
  );
}
