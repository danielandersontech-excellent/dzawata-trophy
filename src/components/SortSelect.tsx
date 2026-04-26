'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';

const OPTIONS = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'nama', label: 'Nama A–Z' },
  { value: 'harga-asc', label: 'Harga Terendah' },
  { value: 'harga-desc', label: 'Harga Tertinggi' },
];

export default function SortSelect({ current = 'terbaru' }: { current?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(sp.toString());
    if (e.target.value === 'terbaru') params.delete('sort');
    else params.set('sort', e.target.value);
    const qs = params.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  };

  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      disabled={isPending}
      className="input !py-2 !px-3 text-sm !w-auto"
      aria-label="Urutkan produk"
    >
      {OPTIONS.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
