import Image from 'next/image';
import Link from 'next/link';
import LoginForm from '@/components/admin/LoginForm';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login Admin',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 flex items-center justify-center px-4 py-10">
      {/* Decorative ornaments */}
      <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-gold-500/30 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-gold-500/30 pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/logo-transparent.png"
            alt="Dzawata Trophy"
            width={120}
            height={120}
            priority
            className="mx-auto drop-shadow-2xl"
          />
          <h1 className="mt-4 font-display text-2xl md:text-3xl font-bold !text-white">Panel Admin</h1>
          <p className="mt-1 text-navy-200 text-sm">Masuk untuk mengelola produk</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <Suspense fallback={<div className="h-40" />}>
            <LoginForm />
          </Suspense>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-navy-200 hover:text-gold-300 transition-colors">
            ← Kembali ke website
          </Link>
        </div>
      </div>
    </div>
  );
}
