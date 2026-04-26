import { createClient } from '@/lib/supabase/server';
import SettingsForm from '@/components/admin/SettingsForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pengaturan Toko',
  robots: { index: false, follow: false },
};

export default async function PengaturanPage() {
  const supabase = createClient();
  const { data: pengaturan } = await supabase
    .from('pengaturan_toko')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  return (
    <div className="space-y-5 md:space-y-6 max-w-3xl">
      <header>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-navy-700">
          Pengaturan Toko
        </h1>
        <p className="text-ink-muted text-sm mt-1">
          Kelola informasi toko, kontak, dan template pesan WhatsApp
        </p>
      </header>

      <SettingsForm pengaturan={pengaturan || {}} />
    </div>
  );
}
