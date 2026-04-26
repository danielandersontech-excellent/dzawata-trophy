'use client';

import { useState, useTransition } from 'react';
import { updatePengaturan } from '@/app/admin/actions';
import type { PengaturanToko } from '@/lib/types';

type Props = {
  pengaturan: Partial<PengaturanToko>;
};

export default function SettingsForm({ pengaturan }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const res = await updatePengaturan(formData);
      if (res?.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' });
        // Hilangkan pesan sukses setelah 4 detik
        setTimeout(() => setMessage(null), 4000);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`rounded-lg px-4 py-3 text-sm border ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Identitas Toko */}
      <div className="bg-white rounded-xl shadow-card p-5 md:p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-navy-700">Identitas Toko</h2>
          <p className="text-sm text-ink-subtle mt-0.5">
            Informasi ini muncul di header, footer, dan halaman beranda
          </p>
        </div>

        <div>
          <label htmlFor="nama_toko" className="label">
            Nama Toko <span className="text-rose-500">*</span>
          </label>
          <input
            id="nama_toko"
            name="nama_toko"
            type="text"
            required
            defaultValue={pengaturan.nama_toko || ''}
            placeholder="Dzawata Trophy"
            className="input"
            disabled={isPending}
          />
        </div>

        <div>
          <label htmlFor="tagline" className="label">Tagline</label>
          <input
            id="tagline"
            name="tagline"
            type="text"
            defaultValue={pengaturan.tagline || ''}
            placeholder="Piala, Plakat, Medali & Trofi Berkualitas"
            className="input"
            disabled={isPending}
          />
          <p className="mt-1 text-xs text-ink-subtle">Slogan singkat yang muncul di hero section</p>
        </div>

        <div>
          <label htmlFor="deskripsi" className="label">Deskripsi Toko</label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            rows={4}
            defaultValue={pengaturan.deskripsi || ''}
            placeholder="Ceritakan tentang toko Anda — sejarah, keunggulan, layanan…"
            className="input resize-y"
            disabled={isPending}
          />
          <p className="mt-1 text-xs text-ink-subtle">Tampil di halaman "Tentang Kami" dan beranda</p>
        </div>
      </div>

      {/* Kontak WhatsApp */}
      <div className="bg-white rounded-xl shadow-card p-5 md:p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-navy-700">Kontak WhatsApp</h2>
          <p className="text-sm text-ink-subtle mt-0.5">
            Tombol WhatsApp di seluruh website akan mengarah ke nomor ini
          </p>
        </div>

        <div>
          <label htmlFor="nomor_wa" className="label">
            Nomor WhatsApp <span className="text-rose-500">*</span>
          </label>
          <input
            id="nomor_wa"
            name="nomor_wa"
            type="tel"
            defaultValue={pengaturan.nomor_wa || ''}
            placeholder="08123456789"
            className="input"
            disabled={isPending}
          />
          <p className="mt-1 text-xs text-ink-subtle">
            Format: <code className="bg-cream px-1.5 py-0.5 rounded">08xxx</code> atau{' '}
            <code className="bg-cream px-1.5 py-0.5 rounded">628xxx</code>. Sistem akan otomatis konversi.
          </p>
        </div>

        <div>
          <label htmlFor="pesan_wa_default" className="label">Template Pesan WhatsApp</label>
          <textarea
            id="pesan_wa_default"
            name="pesan_wa_default"
            rows={4}
            defaultValue={pengaturan.pesan_wa_default || ''}
            placeholder="Halo {nama_toko}, saya tertarik dengan {nama_produk} ({kategori}). Bisa info lebih lanjut?"
            className="input resize-y font-mono text-sm"
            disabled={isPending}
          />
          <div className="mt-2 text-xs text-ink-subtle">
            <p className="font-medium text-ink-muted mb-1">Variabel yang bisa dipakai:</p>
            <div className="flex flex-wrap gap-1.5">
              {['{nama_toko}', '{nama_produk}', '{kategori}', '{harga}'].map(v => (
                <code key={v} className="bg-cream text-navy-600 px-2 py-0.5 rounded">{v}</code>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lokasi & Jam */}
      <div className="bg-white rounded-xl shadow-card p-5 md:p-6 space-y-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-navy-700">Lokasi & Jam Operasional</h2>
          <p className="text-sm text-ink-subtle mt-0.5">Tampil di halaman "Tentang Kami" dan footer</p>
        </div>

        <div>
          <label htmlFor="alamat" className="label">Alamat</label>
          <textarea
            id="alamat"
            name="alamat"
            rows={2}
            defaultValue={pengaturan.alamat || ''}
            placeholder="Jl. Contoh No. 123, Kota, Provinsi 12345"
            className="input resize-y"
            disabled={isPending}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="jam_operasional" className="label">Jam Operasional</label>
            <input
              id="jam_operasional"
              name="jam_operasional"
              type="text"
              defaultValue={pengaturan.jam_operasional || ''}
              placeholder="Senin - Sabtu, 08.00 - 17.00"
              className="input"
              disabled={isPending}
            />
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={pengaturan.email || ''}
              placeholder="kontak@dzawatatrophy.com"
              className="input"
              disabled={isPending}
            />
          </div>
        </div>

        <div>
          <label htmlFor="google_maps_url" className="label">Link Google Maps</label>
          <input
            id="google_maps_url"
            name="google_maps_url"
            type="url"
            defaultValue={pengaturan.google_maps_url || ''}
            placeholder="https://maps.app.goo.gl/..."
            className="input"
            disabled={isPending}
          />
          <p className="mt-1 text-xs text-ink-subtle">
            Tombol "Lihat di Google Maps" akan muncul di halaman Tentang
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="sticky bottom-4 bg-white rounded-xl shadow-card-hover p-4 flex items-center justify-between gap-3">
        <p className="text-xs text-ink-subtle hidden sm:block">
          Perubahan akan terlihat di website setelah disimpan
        </p>
        <button type="submit" disabled={isPending} className="btn-primary !py-2.5 !px-6 ml-auto">
          {isPending ? 'Menyimpan…' : 'Simpan Pengaturan'}
        </button>
      </div>
    </form>
  );
}
