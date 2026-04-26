/**
 * Bangun URL wa.me dengan pesan auto-fill.
 * Hanya menggunakan link standar (gratis, tanpa API).
 */

type BuildArgs = {
  nomorWa: string;
  template?: string | null;
  variables?: Record<string, string>;
};

/**
 * Sanitasi nomor: hilangkan +, spasi, dash. Kalau dimulai 0 → ganti 62.
 */
export function normalizeWaNumber(num: string | null | undefined): string {
  if (!num) return '';
  let n = num.replace(/[^0-9]/g, '');
  if (n.startsWith('0')) n = '62' + n.slice(1);
  return n;
}

/**
 * Replace {placeholder} dalam template dengan nilai dari variables.
 */
function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

export function buildWhatsAppUrl({ nomorWa, template, variables }: BuildArgs): string {
  const num = normalizeWaNumber(nomorWa);
  if (!num) return '#';

  const defaultTemplate = 'Halo, saya tertarik dengan produk Anda.';
  const message = fillTemplate(template || defaultTemplate, variables || {});
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

/**
 * Pesan default umum (tanpa produk spesifik)
 */
export function buildGeneralWhatsAppUrl(nomorWa: string, namaToko: string = 'Dzawata Trophy'): string {
  return buildWhatsAppUrl({
    nomorWa,
    template: `Halo ${namaToko}, saya ingin bertanya mengenai produk yang tersedia. Terima kasih.`,
  });
}
