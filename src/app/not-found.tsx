import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-display text-7xl md:text-9xl text-gold-500 font-bold opacity-90">404</p>
        <h1 className="mt-2 font-display text-2xl md:text-3xl text-navy-700 font-semibold">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-3 text-ink-muted">
          Halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau belum tersedia.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">Kembali ke Beranda</Link>
          <Link href="/katalog" className="btn-outline">Lihat Katalog</Link>
        </div>
      </div>
    </div>
  );
}
