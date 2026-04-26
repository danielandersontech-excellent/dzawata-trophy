'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { formatFileSize } from '@/lib/utils';

type ExistingFoto = {
  id: string;
  url: string;
};

type Props = {
  /** Foto yang sudah ada di server (untuk mode edit) */
  existing?: ExistingFoto[];
  /** Maksimum total foto */
  max?: number;
  /** Callback ketika user request hapus foto existing */
  onRemoveExisting?: (id: string) => void | Promise<void>;
  /** Nama field untuk file baru (FormData key) */
  name?: string;
};

type Preview = {
  file: File;
  url: string;
  error?: string;
};

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUploader({
  existing = [],
  max = 5,
  onRemoveExisting,
  name = 'foto',
}: Props) {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [removing, setRemoving] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalCount = existing.length + previews.length;
  const remaining = max - totalCount;

  /**
   * Sync FileList di <input> setiap kali `previews` berubah.
   * Lebih aman daripada panggil sync langsung di event handler — state update
   * di React itu async; di handler kita masih lihat state lama. useEffect
   * berjalan SETELAH render jadi `previews` sudah versi terbaru.
   */
  useEffect(() => {
    if (typeof DataTransfer === 'undefined') return;
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    previews.filter(p => !p.error).forEach(p => dt.items.add(p.file));
    inputRef.current.files = dt.files;
  }, [previews]);

  /**
   * Cleanup ObjectURL saat unmount untuk hindari memory leak.
   */
  useEffect(() => {
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    setPreviews(prev => {
      const next = [...prev];
      Array.from(files).forEach(file => {
        if (existing.length + next.length >= max) return;
        let error: string | undefined;
        if (!ALLOWED.includes(file.type)) {
          error = 'Format harus JPG, PNG, atau WebP.';
        } else if (file.size > MAX_SIZE) {
          error = `Ukuran maks 5MB (file ini ${formatFileSize(file.size)}).`;
        }
        next.push({
          file,
          url: URL.createObjectURL(file),
          error,
        });
      });
      return next;
    });

    // Reset input value supaya user bisa pilih file yang sama lagi setelah hapus
    if (inputRef.current) inputRef.current.value = '';
  };

  const removePreview = (index: number) => {
    setPreviews(prev => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleRemoveExisting = async (id: string) => {
    if (!onRemoveExisting) return;
    if (!confirm('Hapus foto ini?')) return;
    setRemoving(id);
    try {
      await onRemoveExisting(id);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden file input — dikontrol via DataTransfer di useEffect */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Foto existing */}
      {existing.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {existing.map(f => (
            <div key={f.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
              <Image src={f.url} alt="Foto" fill sizes="120px" className="object-cover" />
              <span className="absolute top-1.5 left-1.5 badge bg-emerald-50 text-emerald-700 text-[10px] !px-1.5 !py-0.5">Tersimpan</span>
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => handleRemoveExisting(f.id)}
                  disabled={removing === f.id}
                  className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-medium transition-opacity disabled:opacity-50"
                >
                  {removing === f.id ? 'Menghapus…' : '🗑️ Hapus'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Foto baru (preview) */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {previews.map((p, i) => (
            <div key={i} className={`relative aspect-square rounded-lg overflow-hidden border-2 ${p.error ? 'border-rose-300' : 'border-gold-300'}`}>
              <Image src={p.url} alt={`Preview ${i + 1}`} fill sizes="120px" className="object-cover" unoptimized />
              <span className="absolute top-1.5 left-1.5 badge bg-gold-50 text-gold-700 text-[10px] !px-1.5 !py-0.5">Baru</span>
              <button
                type="button"
                onClick={() => removePreview(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 text-sm leading-none"
                aria-label="Hapus dari pilihan"
              >×</button>
              {p.error && (
                <div className="absolute bottom-0 inset-x-0 bg-rose-600/90 text-white text-[10px] p-1 text-center leading-tight">
                  {p.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone / upload button */}
      {remaining > 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 hover:border-gold-400 hover:bg-gold-50/30 rounded-xl p-6 md:p-8 text-center transition-colors"
        >
          <div className="text-3xl mb-2">📷</div>
          <p className="font-medium text-navy-700">
            Klik untuk pilih foto
          </p>
          <p className="text-xs text-ink-subtle mt-1">
            Bisa pilih banyak sekaligus · JPG/PNG/WebP · Maks 5MB · Sisa <strong>{remaining}</strong> dari {max} foto
          </p>
        </button>
      ) : (
        <p className="text-xs text-ink-subtle text-center bg-cream rounded-lg p-3">
          Maksimum {max} foto per produk sudah tercapai.
        </p>
      )}
    </div>
  );
}
