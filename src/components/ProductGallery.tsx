'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { FotoProduk } from '@/lib/types';

type Props = {
  fotos: FotoProduk[];
  altBase: string;
};

export default function ProductGallery({ fotos, altBase }: Props) {
  const [active, setActive] = useState(0);
  const sorted = [...fotos].sort((a, b) => a.urutan - b.urutan);
  const main = sorted[active];

  if (sorted.length === 0) {
    return (
      <div className="aspect-square bg-gradient-to-br from-cream to-navy-50 rounded-2xl flex items-center justify-center text-navy-300">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square bg-gradient-to-br from-cream to-navy-50 rounded-2xl overflow-hidden shadow-card">
        <Image
          key={main.id}
          src={main.url}
          alt={`${altBase} - foto ${active + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain animate-fade-in"
          priority
        />

        {sorted.length > 1 && (
          <>
            <button
              onClick={() => setActive(a => (a - 1 + sorted.length) % sorted.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-navy-700 shadow-soft flex items-center justify-center backdrop-blur transition-all"
              aria-label="Foto sebelumnya"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button
              onClick={() => setActive(a => (a + 1) % sorted.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-navy-700 shadow-soft flex items-center justify-center backdrop-blur transition-all"
              aria-label="Foto berikutnya"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-navy-900/70 text-white text-xs backdrop-blur">
              {active + 1} / {sorted.length}
            </div>
          </>
        )}
      </div>

      {sorted.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2.5">
          {sorted.map((foto, i) => (
            <button
              key={foto.id}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                i === active
                  ? 'border-gold-500 ring-2 ring-gold-200 scale-[0.97]'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-navy-200'
              }`}
              aria-label={`Lihat foto ${i + 1}`}
            >
              <Image
                src={foto.url}
                alt={`Thumbnail ${i + 1}`}
                width={120}
                height={120}
                className="w-full h-full object-cover bg-cream"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
