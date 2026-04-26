'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/katalog', label: 'Katalog' },
  { href: '/tentang', label: 'Tentang' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu saat ganti halaman
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll saat menu open di mobile
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft'
          : 'bg-cream/80 backdrop-blur-sm'
      }`}
    >
      <div className="container-page">
        <nav className="flex items-center justify-between h-16 md:h-20">
          <Logo className="h-9 md:h-11 w-auto" />

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                    isActive(href)
                      ? 'text-navy-700'
                      : 'text-ink-muted hover:text-navy-600'
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gold-500 rounded-full" />
                  )}
                </Link>
              </li>
            ))}
            <li className="ml-4">
              <Link href="/katalog" className="btn-gold !py-2 !px-5 text-sm">
                Lihat Katalog
              </Link>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden p-2 text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile menu drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          open ? 'max-h-screen border-t border-gold-200' : 'max-h-0'
        }`}
      >
        <ul className="container-page py-4 space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive(href)
                    ? 'bg-navy-50 text-navy-700'
                    : 'text-ink-muted hover:bg-cream hover:text-navy-600'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link href="/katalog" className="btn-gold w-full">
              Lihat Katalog
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
