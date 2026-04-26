'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  onConfirm: () => Promise<{ error?: string; success?: boolean } | void>;
  label?: string;
  message?: string;
  className?: string;
  iconOnly?: boolean;
};

export default function DeleteButton({
  onConfirm,
  label = 'Hapus',
  message = 'Yakin ingin menghapus? Aksi ini tidak dapat dibatalkan.',
  className = '',
  iconOnly = false,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      // Auto-cancel setelah 5 detik
      setTimeout(() => setConfirming(false), 5000);
      return;
    }
    startTransition(async () => {
      const res = await onConfirm();
      if (res && 'error' in res && res.error) {
        alert('Gagal menghapus: ' + res.error);
        setConfirming(false);
      } else {
        router.refresh();
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
        confirming
          ? 'bg-rose-600 text-white hover:bg-rose-700'
          : 'text-rose-600 hover:bg-rose-50'
      } ${className}`}
      title={confirming ? 'Klik lagi untuk konfirmasi' : message}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
      {!iconOnly && (isPending ? 'Menghapus…' : confirming ? 'Klik lagi!' : label)}
    </button>
  );
}
