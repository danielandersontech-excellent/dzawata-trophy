import Image from 'next/image';
import Link from 'next/link';

type Props = {
  className?: string;
  href?: string | null;
  size?: number;
  showText?: boolean;
  alt?: string;
};

/**
 * Logo Dzawata Trophy. Logo asli berupa badge bulat hitam-emas
 * dengan background TRANSPARAN (logo-transparent.png).
 *
 * - Jika `className` diberikan, ukuran ditentukan oleh class CSS
 *   (mis. "h-10 w-auto"). `size` hanya dipakai sebagai hint
 *   untuk attribute `width`/`height` (untuk aspect ratio + layout).
 * - Jika tidak ada `className`, fallback ke ukuran fixed dari `size`.
 */
export default function Logo({
  className = '',
  href = '/',
  size = 56,
  showText = false,
  alt = 'Dzawata Trophy',
}: Props) {
  const inner = (
    <span className="inline-flex items-center gap-3">
      <Image
        src="/logo-transparent.png"
        alt={alt}
        width={size}
        height={size}
        priority
        className={className || ''}
        style={className ? undefined : { width: size, height: size, objectFit: 'contain' }}
      />
      {showText && (
        <span className="hidden sm:flex flex-col leading-none">
          <span className="font-display font-bold text-lg md:text-xl text-navy-700 tracking-wide">
            DZAWATA
          </span>
          <span className="font-sans text-[10px] md:text-xs text-gold-600 tracking-[0.4em] mt-0.5">
            TROPHY
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return inner;

  return (
    <Link href={href} aria-label={`${alt} — Beranda`} className="inline-flex items-center">
      {inner}
    </Link>
  );
}
