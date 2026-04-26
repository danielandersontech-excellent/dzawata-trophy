import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ProdukTableRow from '@/components/admin/ProdukTableRow';
import type { Metadata } from 'next';
import type { ProdukWithRelations } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Daftar Produk',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminProdukPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = createClient();
  const q = (searchParams.q || '').trim();

  let query = supabase
    .from('produk')
    .select('*, kategori:kategori_id(*), foto_produk(*)')
    .order('updated_at', { ascending: false });

  if (q) {
    // Escape karakter yang bisa pecah PostgREST .or() string:
    // koma, kutip, tanda kurung. Ambil maksimal 100 karakter.
    const safe = q.replace(/[,'"()]/g, ' ').slice(0, 100);
    query = query.or(`nama.ilike.%${safe}%,deskripsi.ilike.%${safe}%`);
  }

  const { data: produkList } = await query;
  const produk = (produkList || []) as ProdukWithRelations[];

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-navy-700">Daftar Produk</h1>
          <p className="text-ink-muted text-sm mt-1">
            {produk.length} produk total {q && <>· Hasil pencarian: <strong>&quot;{q}&quot;</strong></>}
          </p>
        </div>
        <Link href="/admin/produk/tambah" className="btn-gold !py-2.5 !px-5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Tambah Produk
        </Link>
      </div>

      {/* Search */}
      <form className="bg-white rounded-xl shadow-card p-4">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Cari nama atau deskripsi…"
            className="input pl-10"
          />
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {produk.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-ink-subtle text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Produk</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Kategori</th>
                  <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Harga</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-center px-4 py-3 font-medium hidden lg:table-cell">Unggulan</th>
                  <th className="text-right px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produk.map(p => (
                  <ProdukTableRow key={p.id} p={p} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 md:p-16 text-center text-ink-muted">
            <p className="text-5xl mb-3 opacity-50">📦</p>
            <p className="font-medium">{q ? `Tidak ada produk yang cocok dengan "${q}"` : 'Belum ada produk'}</p>
            <Link href="/admin/produk/tambah" className="btn-gold mt-5 inline-flex">
              Tambah Produk Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
