import type { Metadata, Viewport } from 'next';
import './globals.css';
import { createClient } from '@/lib/supabase/server';
import { getSiteUrl } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from('pengaturan_toko')
    .select('nama_toko, tagline, deskripsi')
    .eq('id', 1)
    .maybeSingle();

  const namaToko = data?.nama_toko || 'Dzawata Trophy';
  const tagline = data?.tagline || 'Piala, Plakat, Medali & Trofi Berkualitas';
  const deskripsi = data?.deskripsi || `${namaToko} - ${tagline}. Pengrajin profesional untuk piala, plakat, medali, dan trofi custom.`;
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${namaToko} — ${tagline}`,
      template: `%s | ${namaToko}`,
    },
    description: deskripsi,
    keywords: ['piala', 'plakat', 'medali', 'trofi', 'trophy', 'penghargaan', 'akrilik', 'custom', namaToko],
    authors: [{ name: namaToko }],
    creator: namaToko,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/logo-192.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: siteUrl,
      siteName: namaToko,
      title: `${namaToko} — ${tagline}`,
      description: deskripsi,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: namaToko }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${namaToko} — ${tagline}`,
      description: deskripsi,
      images: ['/og-image.png'],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: '#1B376D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
