'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  current: boolean;
  onToggle: () => Promise<{ error?: string; success?: boolean } | void>;
  labelOn?: string;
  labelOff?: string;
  variant?: 'aktif' | 'featured';
};

export default function ToggleStatus({
  current,
  onToggle,
  labelOn = 'Aktif',
  labelOff = 'Nonaktif',
  variant = 'aktif',
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const res = await onToggle();
      if (res && 'error' in res && res.error) {
        alert('Gagal: ' + res.error);
      } else {
        router.refresh();
      }
    });
  };

  const onColor = variant === 'featured'
    ? 'bg-gold-500 text-white'
    : 'bg-emerald-500 text-white';
  const offColor = 'bg-gray-200 text-gray-600';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
        current ? onColor : offColor
      } ${isPending ? 'opacity-50' : 'hover:opacity-90'}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current ? 'bg-white' : 'bg-gray-400'}`} />
      {current ? labelOn : labelOff}
    </button>
  );
}
