import { createClient } from '@/lib/supabase/server';
import { buildGeneralWhatsAppUrl, normalizeWaNumber } from '@/lib/whatsapp';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'Pelajari lebih lanjut tentang Dzawata Trophy dan cara menghubungi kami.',
};

export default async function TentangPage() {
  const supabase = createClient();
  const { data: pengaturan } = await supabase
    .from('pengaturan_toko')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  const namaToko = pengaturan?.nama_toko || 'Dzawata Trophy';
  const wa = pengaturan?.nomor_wa || '';
  const waOk = !!normalizeWaNumber(wa);
  const waUrl = waOk ? buildGeneralWhatsAppUrl(wa, namaToko) : '#';

  return (
    <>
      <section className="bg-gradient-to-br from-navy-700 to-navy-800 text-white py-14 md:py-20">
        <div className="container-page text-center">
          <p className="ornamental-rule justify-center text-gold-400 mb-3">Profil Toko</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold !text-white">Tentang {namaToko}</h1>
          <p className="mt-4 text-navy-100 max-w-2xl mx-auto text-base md:text-lg">
            {pengaturan?.tagline || 'Pengrajin profesional untuk piala, plakat, medali, dan trofi berkualitas.'}
          </p>
        </div>
      </section>

      <section className="container-page py-12 md:py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="heading-section">Kisah Kami</h2>
          <div className="mt-5 prose-trophy text-base md:text-lg whitespace-pre-line">
            {pengaturan?.deskripsi ||
              `${namaToko} adalah penyedia piala, plakat, medali, dan trofi berkualitas untuk berbagai keperluan: penghargaan instansi, lomba sekolah, turnamen olahraga, hingga acara perusahaan.

Kami melayani pemesanan dengan custom desain dan finishing premium, dengan komitmen pada kualitas dan ketepatan waktu pengiriman.`}
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {[
              ['🏆', 'Custom Desain', 'Desain bisa disesuaikan dengan kebutuhan acara Anda'],
              ['⚡', 'Pengerjaan Cepat', 'Estimasi pengerjaan jelas dan tepat waktu'],
              ['✦', 'Kualitas Premium', 'Bahan berkualitas dengan finishing rapi'],
            ].map(([ic, title, desc]) => (
              <div key={title} className="bg-white p-5 rounded-xl shadow-card">
                <div className="text-3xl mb-2 text-gold-500">{ic}</div>
                <h3 className="font-display font-semibold text-navy-700 text-lg">{title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="bg-white rounded-2xl shadow-card p-6 md:p-8 h-fit lg:sticky lg:top-24">
          <h3 className="font-display text-xl md:text-2xl font-semibold text-navy-700">Kontak & Lokasi</h3>
          <div className="mt-5 space-y-4 text-sm">
            {waOk && (
              <div>
                <p className="text-ink-subtle text-xs uppercase tracking-wider">WhatsApp</p>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-navy-700 hover:text-gold-600 inline-flex items-center gap-1.5 mt-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/></svg>
                  +{normalizeWaNumber(wa)}
                </a>
              </div>
            )}
            {pengaturan?.email && (
              <div>
                <p className="text-ink-subtle text-xs uppercase tracking-wider">Email</p>
                <a href={`mailto:${pengaturan.email}`} className="font-medium text-navy-700 hover:text-gold-600">
                  {pengaturan.email}
                </a>
              </div>
            )}
            {pengaturan?.alamat && (
              <div>
                <p className="text-ink-subtle text-xs uppercase tracking-wider">Alamat</p>
                <p className="font-medium text-navy-700 mt-1 whitespace-pre-line">{pengaturan.alamat}</p>
              </div>
            )}
            {pengaturan?.jam_operasional && (
              <div>
                <p className="text-ink-subtle text-xs uppercase tracking-wider">Jam Operasional</p>
                <p className="font-medium text-navy-700 mt-1">{pengaturan.jam_operasional}</p>
              </div>
            )}
          </div>

          {waOk && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full mt-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/></svg>
              Chat Sekarang
            </a>
          )}

          {pengaturan?.google_maps_url && (
            <a href={pengaturan.google_maps_url} target="_blank" rel="noopener noreferrer" className="btn-outline w-full mt-3 text-sm">
              📍 Lihat di Google Maps
            </a>
          )}
        </aside>
      </section>
    </>
  );
}
