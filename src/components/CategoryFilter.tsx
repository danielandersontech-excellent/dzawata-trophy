'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import type { Kategori } from '@/lib/types';

type Props = {
  kategori: Kategori[];
  current?: string;
};

export default function CategoryFilter({ kategori, current }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const update = (slug?: string) => {
    const params = new URLSearchParams(sp.toString());
    if (slug) params.set('kategori', slug);
    else params.delete('kategori');
    const qs = params.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
      <button
        onClick={() => update(undefined)}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
          !current
            ? 'bg-navy-700 text-white border-navy-700'
            : 'bg-white text-ink-muted border-gray-200 hover:border-navy-300 hover:text-navy-600'
        }`}
        disabled={isPending}
      >
        Semua
      </button>
      {kategori.map(k => {
        const active = current === k.slug;
        return (
          <button
            key={k.id}
            onClick={() => update(k.slug)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
              active
                ? 'bg-navy-700 text-white border-navy-700'
                : 'bg-white text-ink-muted border-gray-200 hover:border-navy-300 hover:text-navy-600'
            }`}
            disabled={isPending}
          >
            {k.nama}
          </button>
        );
      })}
    </div>
  );
}
