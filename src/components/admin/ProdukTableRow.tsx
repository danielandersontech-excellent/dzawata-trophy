'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import DeleteButton from './DeleteButton';
import { formatRupiah } from '@/lib/utils';
import { toggleProdukAktif, toggleProdukFeatured, deleteProduk } from '@/app/admin/actions';
import type { ProdukWithRelations } from '@/lib/types';

type Props = { p: ProdukWithRelations };

/**
 * Satu baris di tabel daftar produk admin. Dipisah jadi Client Component
 * supaya bisa membungkus server action dengan closure berisi `p.id` —
 * Server Component tidak bisa pass inline arrow function ke Client Component.
 */
export default function ProdukTableRow({ p }: Props) {
  const router = useRouter();
  const fotoUtama = p.foto_produk?.[0]?.url;

  const handleToggleAktif = async () => {
    const res = await toggleProdukAktif(p.id, p.is_aktif);
    if (res?.error) alert('Gagal: ' + res.error);
    else router.refresh();
  };

  const handleToggleFeatured = async () => {
    const res = await toggleProdukFeatured(p.id, p.is_featured);
    if (res?.error) alert('Gagal: ' + res.error);
    else router.refresh();
  };

  const handleDelete = async () => deleteProduk(p.id);

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 shrink-0 rounded-md overflow-hidden bg-cream">
            {fotoUtama ? (
              <Image src={fotoUtama} alt={p.nama} fill sizes="48px" className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-navy-200 text-xl">🏆</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-ink truncate">{p.nama}</p>
            <p className="text-xs text-ink-subtle md:hidden">
              {p.kategori?.nama || '—'} · {formatRupiah(p.harga_mulai)}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-ink-muted hidden md:table-cell">
        {p.kategori?.nama || <span className="text-ink-subtle">—</span>}
      </td>
      <td className="px-4 py-3 text-right font-medium text-gold-700 hidden md:table-cell whitespace-nowrap">
        {formatRupiah(p.harga_mulai)}
      </td>
      <td className="px-4 py-3 text-center">
        <ToggleButton
          current={p.is_aktif}
          onClick={handleToggleAktif}
          labelOn="Aktif"
          labelOff="Nonaktif"
          variant="aktif"
        />
      </td>
      <td className="px-4 py-3 text-center hidden lg:table-cell">
        <ToggleButton
          current={p.is_featured}
          onClick={handleToggleFeatured}
          labelOn="Unggulan"
          labelOff="Biasa"
          variant="featured"
        />
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <div className="inline-flex items-center gap-1">
          <Link
            href={`/admin/produk/${p.id}/edit`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-navy-600 hover:bg-navy-50 rounded-md"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <span className="hidden sm:inline">Edit</span>
          </Link>
          <DeleteButton onConfirm={handleDelete} iconOnly={false} />
        </div>
      </td>
    </tr>
  );
}

/**
 * Local toggle button — embed-kan di sini supaya tidak duplikasi prop interface.
 */
function ToggleButton({
  current,
  onClick,
  labelOn,
  labelOff,
  variant,
}: {
  current: boolean;
  onClick: () => Promise<void>;
  labelOn: string;
  labelOff: string;
  variant: 'aktif' | 'featured';
}) {
  const [isPending, startTransition] = useTransition();
  const onColor = variant === 'featured' ? 'bg-gold-500 text-white' : 'bg-emerald-500 text-white';
  const offColor = 'bg-gray-200 text-gray-600';

  return (
    <button
      type="button"
      onClick={() => startTransition(onClick)}
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
