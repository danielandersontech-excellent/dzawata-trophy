import Link from 'next/link';
import Image from 'next/image';
import { formatRupiah, truncate } from '@/lib/utils';
import type { ProdukWithRelations } from '@/lib/types';

type Props = {
  produk: ProdukWithRelations;
  priority?: boolean;
};

export default function ProductCard({ produk, priority = false }: Props) {
  const fotoUtama = produk.foto_produk?.[0]?.url;
  const kategori = produk.kategori?.nama;

  return (
    <Link
      href={`/katalog/${produk.slug}`}
      className="card group flex flex-col h-full overflow-hidden"
    >
      {/* Foto */}
      <div className="relative aspect-square bg-gradient-to-br from-cream to-navy-50 overflow-hidden">
        {fotoUtama ? (
          <Image
            src={fotoUtama}
            alt={produk.nama}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        )}
        {kategori && (
          <span className="absolute top-3 left-3 badge-gold backdrop-blur-sm bg-gold-50/90 text-xs">
            {kategori}
          </span>
        )}
        {produk.is_featured && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 badge bg-navy-700/90 text-gold-200 backdrop-blur-sm text-xs">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.39 7.36H22l-6.18 4.49L18.21 22 12 17.5 5.79 22l2.39-8.15L2 9.36h7.61z"/></svg>
            Unggulan
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-navy-700 text-lg leading-tight group-hover:text-navy-600 transition-colors">
          {truncate(produk.nama, 60)}
        </h3>
        {produk.deskripsi && (
          <p className="mt-1.5 text-sm text-ink-muted line-clamp-2">
            {truncate(produk.deskripsi, 90)}
          </p>
        )}
        <div className="mt-auto pt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-ink-subtle">
              {produk.harga_mulai > 0 ? 'Mulai Dari' : 'Harga'}
            </p>
            <p className="font-display font-bold text-xl text-gold-600">
              {formatRupiah(produk.harga_mulai)}
            </p>
          </div>
          <span className="text-xs font-medium text-navy-600 group-hover:translate-x-1 transition-transform">
            Lihat Detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
