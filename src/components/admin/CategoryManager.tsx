'use client';

import { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DeleteButton from './DeleteButton';
import { createKategori, updateKategori, deleteKategori } from '@/app/admin/actions';
import type { Kategori } from '@/lib/types';

type Props = { kategori: Kategori[] };

export default function CategoryManager({ kategori }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleAdd = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await createKategori(formData);
      if (res?.error) setError(res.error);
      else {
        formRef.current?.reset();
        router.refresh();
      }
    });
  };

  const handleUpdate = (id: string) => (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await updateKategori(id, formData);
      if (res?.error) setError(res.error);
      else {
        setEditing(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Form tambah */}
      <form ref={formRef} action={handleAdd} className="bg-white rounded-xl shadow-card p-5 md:p-6">
        <h2 className="font-display text-lg font-semibold text-navy-700 mb-4">Tambah Kategori Baru</h2>
        <div className="grid sm:grid-cols-[1fr_140px_auto] gap-3">
          <div>
            <label htmlFor="kat-nama" className="label">Nama Kategori</label>
            <input
              id="kat-nama"
              name="nama"
              type="text"
              required
              placeholder="Contoh: Plakat Akrilik"
              className="input"
              disabled={isPending}
            />
          </div>
          <div>
            <label htmlFor="kat-urutan" className="label">Urutan</label>
            <input
              id="kat-urutan"
              name="urutan"
              type="number"
              defaultValue={kategori.length}
              className="input"
              disabled={isPending}
            />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={isPending} className="btn-gold w-full sm:w-auto !py-2.5">
              {isPending ? 'Menambah…' : 'Tambah'}
            </button>
          </div>
        </div>
      </form>

      {/* Daftar */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="px-5 md:px-6 py-4 border-b border-gray-100">
          <h2 className="font-display text-lg font-semibold text-navy-700">Daftar Kategori</h2>
          <p className="text-xs text-ink-subtle mt-0.5">{kategori.length} kategori. Urutan kecil = tampil duluan.</p>
        </div>

        {kategori.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {kategori.map(k => (
              <li key={k.id} className="px-5 md:px-6 py-3">
                {editing === k.id ? (
                  <form action={handleUpdate(k.id)} className="grid sm:grid-cols-[1fr_120px_auto_auto] gap-2 items-center">
                    <input
                      name="nama"
                      type="text"
                      required
                      defaultValue={k.nama}
                      className="input"
                      disabled={isPending}
                      autoFocus
                    />
                    <input
                      name="urutan"
                      type="number"
                      defaultValue={k.urutan}
                      className="input"
                      disabled={isPending}
                    />
                    <button type="submit" disabled={isPending} className="btn-primary !py-2 !px-4 text-sm">
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      disabled={isPending}
                      className="btn-ghost text-sm"
                    >
                      Batal
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="badge-navy shrink-0">#{k.urutan}</span>
                      <span className="font-medium text-ink truncate">{k.nama}</span>
                      <span className="text-xs text-ink-subtle hidden sm:inline truncate">/{k.slug}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditing(k.id)}
                        className="text-xs font-medium text-navy-600 hover:bg-navy-50 px-2.5 py-1.5 rounded-md inline-flex items-center gap-1"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </button>
                      <DeleteButton onConfirm={async () => deleteKategori(k.id)} />
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-10 text-center text-ink-muted">
            <p className="text-4xl mb-2 opacity-50">🏷️</p>
            <p>Belum ada kategori. Tambahkan kategori pertama di atas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
