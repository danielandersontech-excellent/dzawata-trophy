import Link from 'next/link';
import Logo from './Logo';
import { createClient } from '@/lib/supabase/server';
import { buildGeneralWhatsAppUrl, normalizeWaNumber } from '@/lib/whatsapp';

export default async function Footer() {
  const supabase = createClient();

  const [{ data: pengaturan }, { data: kategori }] = await Promise.all([
    supabase.from('pengaturan_toko').select('*').eq('id', 1).maybeSingle(),
    supabase.from('kategori').select('nama, slug').order('urutan', { ascending: true }).limit(6),
  ]);

  const namaToko = pengaturan?.nama_toko || 'Dzawata Trophy';
  const tagline = pengaturan?.tagline || '';
  const wa = pengaturan?.nomor_wa || '';
  const waUrl = buildGeneralWhatsAppUrl(wa, namaToko);
  const waDisplay = normalizeWaNumber(wa);
  const tahun = new Date().getFullYear();

  return (
    <footer className="bg-navy-700 text-navy-100 mt-20">
      <div className="container-page py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo className="h-14 w-auto" href={undefined} />
            <p className="mt-4 text-navy-200 text-sm leading-relaxed max-w-md">
              {tagline || 'Spesialis pembuatan piala, plakat, medali, dan trofi berkualitas untuk berbagai keperluan.'}
            </p>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Kategori</h3>
            <ul className="space-y-2">
              {(kategori || []).map(k => (
                <li key={k.slug}>
                  <Link href={`/katalog?kategori=${k.slug}`} className="text-sm text-navy-200 hover:text-gold-300 transition-colors">
                    {k.nama}
                  </Link>
                </li>
              ))}
              {(!kategori || kategori.length === 0) && (
                <li className="text-sm text-navy-300">Belum ada kategori</li>
              )}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Kontak</h3>
            <ul className="space-y-2.5 text-sm">
              {waDisplay && (
                <li>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-navy-200 hover:text-gold-300 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4l-2.7-1.3c-.3-.1-.7-.1-.9.2l-1.2 1.4c-1.9-.9-3.4-2.4-4.3-4.3l1.4-1.2c.3-.2.4-.6.2-.9L8.6 5.5c-.2-.4-.6-.6-1-.5l-2.3.7c-.4.1-.7.5-.7 1 .3 5.7 4.8 10.2 10.5 10.5.5 0 .9-.3 1-.7l.7-2.3c.1-.4-.1-.8-.5-1zm.4-12.4C9.6 1.5 2.5 8.1 3.6 16.6l-1.5 4.6c-.2.7.4 1.3 1.1 1.1l4.6-1.5C16.4 22 23 14.9 22 6.5 21.4 4 19.5 2 17 1.4c-.4-.1-.7.4-.4.7.5.4.9.9 1.2 1.4.2.4.7.5 1 .2.6-.5 1.3-.7 2.1-.7 1.7 0 3 1.3 3 3 0 .8-.3 1.6-.8 2.1-.3.3-.2.8.1 1 .5.3 1.1.5 1.6.5h.5c.3-1.5-.2-3-1.3-4.1z" /></svg>
                    +{waDisplay}
                  </a>
                </li>
              )}
              {pengaturan?.email && (
                <li>
                  <a href={`mailto:${pengaturan.email}`} className="text-navy-200 hover:text-gold-300 transition-colors">
                    {pengaturan.email}
                  </a>
                </li>
              )}
              {pengaturan?.alamat && (
                <li className="text-navy-200">{pengaturan.alamat}</li>
              )}
              {pengaturan?.jam_operasional && (
                <li className="text-navy-200">{pengaturan.jam_operasional}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-600 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-navy-300">
          <p>© {tahun} {namaToko}. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}