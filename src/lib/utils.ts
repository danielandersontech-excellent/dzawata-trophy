/**
 * Format angka rupiah → "Rp 250.000"
 */
export function formatRupiah(value: number | null | undefined): string {
  if (value == null || isNaN(Number(value))) return 'Rp 0';
  if (value === 0) return 'Hubungi Kami';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Buat slug URL-friendly dari teks bebas.
 * "Piala Akrilik 25cm" → "piala-akrilik-25cm"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // hapus accent
    .replace(/[^a-z0-9\s-]/g, '')    // hapus karakter selain alfanumerik
    .replace(/\s+/g, '-')             // spasi → dash
    .replace(/-+/g, '-')              // multiple dash → satu dash
    .replace(/^-+|-+$/g, '');         // trim dash di awal/akhir
}

/**
 * Pastikan slug unik dengan menambah suffix angka jika perlu.
 * Caller wajib mengirim list slug yang sudah ada.
 */
export function uniqueSlug(base: string, existing: string[]): string {
  const root = slugify(base) || 'item';
  if (!existing.includes(root)) return root;
  let i = 2;
  while (existing.includes(`${root}-${i}`)) i++;
  return `${root}-${i}`;
}

/**
 * Truncate teks dengan ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

/**
 * Format ukuran file (bytes → KB/MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Site URL helper (untuk OG, sitemap, dll)
 */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  );
}
