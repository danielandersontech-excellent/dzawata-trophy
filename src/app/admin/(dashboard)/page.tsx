import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = createClient();

  const [{ count: totalProduk }, { count: totalAktif }, { count: totalFeatured }, { count: totalKategori }, { data: latestProduk }] = await Promise.all([
    supabase.from('produk').select('*', { count: 'exact', head: true }),
    supabase.from('produk').select('*', { count: 'exact', head: true }).eq('is_aktif', true),
    supabase.from('produk').select('*', { count: 'exact', head: true }).eq('is_featured', true).eq('is_aktif', true),
    supabase.from('kategori').select('*', { count: 'exact', head: true }),
    supabase.from('produk').select('id, nama, slug, is_aktif, created_at, kategori:kategori_id(nama)').order('created_at', { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: 'Total Produk', value: totalProduk || 0, link: '/admin/produk', color: 'navy' },
    { label: 'Produk Aktif', value: totalAktif || 0, link: '/admin/produk?status=aktif', color: 'emerald' },
    { label: 'Produk Unggulan', value: totalFeatured || 0, link: '/admin/produk?featured=1', color: 'gold' },
    { label: 'Total Kategori', value: totalKategori || 0, link: '/admin/kategori', color: 'navy' },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <header>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-navy-700">Dashboard</h1>
        <p className="text-ink-muted mt-1 text-sm">Ringkasan singkat data toko Anda</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map(s => (
          <Link
            key={s.label}
            href={s.link}
            className="bg-white rounded-xl p-5 md:p-6 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
          >
            <p className="text-xs uppercase tracking-wider text-ink-subtle">{s.label}</p>
            <p className={`mt-2 font-display text-3xl md:text-4xl font-bold ${
              s.color === 'gold' ? 'text-gold-600' :
              s.color === 'emerald' ? 'text-emerald-600' :
              'text-navy-700'
            }`}>
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl shadow-card p-5 md:p-6">
        <h2 className="font-display text-lg md:text-xl font-semibold text-navy-700">Aksi Cepat</h2>
        <div className="mt-4 grid sm:grid-cols-3 gap-3">
          <Link href="/admin/produk/tambah" className="btn-gold !py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Produk
          </Link>
          <Link href="/admin/kategori" className="btn-outline !py-3">
            Kelola Kategori
          </Link>
          <Link href="/admin/pengaturan" className="btn-outline !py-3">
            Pengaturan Toko
          </Link>
        </div>
      </div>

      {/* Latest products */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display text-lg md:text-xl font-semibold text-navy-700">Produk Terbaru</h2>
          <Link href="/admin/produk" className="text-sm text-navy-600 hover:text-navy-700 font-medium">
            Lihat semua →
          </Link>
        </div>
        <div className="overflow-x-auto">
          {(latestProduk && latestProduk.length > 0) ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-ink-subtle text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-5 py-3">Nama</th>
                  <th className="text-left px-5 py-3">Kategori</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-right px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {latestProduk.map(p => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="px-5 py-3 font-medium text-ink">{p.nama}</td>
                    <td className="px-5 py-3 text-ink-muted">{(p.kategori as any)?.nama || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={p.is_aktif ? 'badge-success' : 'badge-gray'}>
                        {p.is_aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/produk/${p.id}/edit`} className="text-navy-600 hover:text-navy-700 font-medium">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center text-ink-muted">
              <p className="text-4xl mb-2 opacity-50">📦</p>
              <p>Belum ada produk.</p>
              <Link href="/admin/produk/tambah" className="btn-gold mt-4 inline-flex">
                Tambah Produk Pertama
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
