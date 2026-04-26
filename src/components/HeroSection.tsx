import Link from 'next/link';
import Image from 'next/image';
import type { PengaturanToko } from '@/lib/types';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';

type Props = {
  pengaturan: Partial<PengaturanToko> | null;
};

export default function HeroSection({ pengaturan }: Props) {
  const namaToko = pengaturan?.nama_toko || 'Dzawata Trophy';
  const tagline = pengaturan?.tagline || 'Piala, Plakat, Medali & Trofi Berkualitas';
  const nomorWa = pengaturan?.nomor_wa || '';
  const waUrl = buildGeneralWhatsAppUrl(nomorWa, namaToko);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 text-white">
      {/* Decorative gold ornament corners */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 w-20 h-20 md:w-32 md:h-32 border-l-2 border-t-2 border-gold-500/30 pointer-events-none" />
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-20 h-20 md:w-32 md:h-32 border-r-2 border-b-2 border-gold-500/30 pointer-events-none" />

      {/* Background trophy pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute -top-20 -right-10 text-[24rem] font-display leading-none select-none">★</div>
        <div className="absolute -bottom-32 -left-16 text-[18rem] font-display leading-none select-none">★</div>
      </div>

      <div className="container-page relative">
        <div className="grid lg:grid-cols-2 gap-10 items-center py-16 md:py-24 lg:py-28">
          {/* Text content */}
          <div className="text-center lg:text-left animate-fade-in">
            <p className="ornamental-rule justify-center lg:justify-start text-gold-400 mb-6">
              Kebanggaan Setiap Pencapaian
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold !text-white leading-[1.05]">
              {namaToko}
            </h1>
            <p className="mt-5 text-lg md:text-xl text-navy-100 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {tagline}
            </p>
            <p className="mt-3 text-sm md:text-base text-navy-200/90 max-w-xl mx-auto lg:mx-0">
              Pengrajin profesional untuk piala, plakat, medali, dan trofi custom.
              Cocok untuk perlombaan, penghargaan instansi, dan acara perusahaan.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/katalog"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold rounded-lg shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all duration-200 hover:-translate-y-0.5"
              >
                Lihat Katalog
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>

              {nomorWa && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-medium rounded-lg border border-white/20 transition-all duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/>
                  </svg>
                  Konsultasi WhatsApp
                </a>
              )}
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 justify-center lg:justify-start text-sm text-navy-100">
              {[
                ['Custom Desain', '🎨'],
                ['Pengiriman Cepat', '🚚'],
                ['Kualitas Premium', '✦'],
              ].map(([label, icon]) => (
                <span key={label} className="inline-flex items-center gap-2">
                  <span className="text-gold-400">{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Logo display */}
          <div className="flex items-center justify-center lg:justify-end animate-slide-up">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-gold-500/30 blur-3xl rounded-full" />
              <div className="relative bg-gradient-to-br from-navy-600/40 to-navy-900/40 p-8 md:p-12 rounded-3xl backdrop-blur-sm border border-gold-500/20">
                <Image
                  src="/logo-transparent.png"
                  alt="Dzawata Trophy"
                  width={400}
                  height={400}
                  priority
                  className="w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
