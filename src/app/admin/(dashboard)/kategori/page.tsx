import { createClient } from '@/lib/supabase/server';
import CategoryManager from '@/components/admin/CategoryManager';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola Kategori',
  robots: { index: false, follow: false },
};

export default async function AdminKategoriPage() {
  const supabase = createClient();
  const { data: kategori } = await supabase
    .from('kategori')
    .select('*')
    .order('urutan', { ascending: true });

  return (
    <div className="space-y-5 md:space-y-6 max-w-3xl">
      <header>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-navy-700">Kelola Kategori</h1>
        <p className="text-ink-muted text-sm mt-1">
          Atur kategori produk yang akan muncul di filter dan menu navigasi
        </p>
      </header>

      <CategoryManager kategori={kategori || []} />
    </div>
  );
}
