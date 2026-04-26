'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';

export default function SearchBar({ placeholder = 'Cari produk…' }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(sp.get('q') ?? '');

  // Sinkron jika URL berubah dari luar
  useEffect(() => {
    setValue(sp.get('q') ?? '');
  }, [sp]);

  // Debounce 300ms
  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(sp.toString());
      const trimmed = value.trim();
      if (trimmed) params.set('q', trimmed);
      else params.delete('q');
      const qs = params.toString();
      const target = qs ? `${pathname}?${qs}` : pathname;
      // Hindari push redundan
      if (target !== `${pathname}${sp.toString() ? '?' + sp.toString() : ''}`) {
        startTransition(() => router.push(target));
      }
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full sm:max-w-sm">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle"
        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="search"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="input pl-10 pr-10"
        aria-label="Cari produk"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          aria-label="Bersihkan pencarian"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-ink-subtle hover:text-ink rounded-md hover:bg-gray-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  );
}
