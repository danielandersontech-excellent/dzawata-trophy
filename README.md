# 🏆 Dzawata Trophy

Website katalog & pemesanan WhatsApp untuk **Dzawata Trophy** — penyedia piala, plakat, medali, dan trofi berkualitas.

![Logo](public/logo.png)

## ✨ Fitur Utama

### Untuk Pengunjung (Publik)

- 🏠 **Beranda** – Hero section dengan logo, kategori produk, produk unggulan
- 📚 **Katalog** – Daftar produk dengan pencarian, filter kategori, dan sorting
- 🔍 **Detail Produk** – Galeri foto, deskripsi, harga, tombol pemesanan WhatsApp
- 📞 **Tentang Kami** – Profil toko, jam operasional, kontak, link Google Maps
- 💬 **WhatsApp Auto-Fill** – Tombol pesan langsung membuka WhatsApp dengan pesan otomatis berisi info produk
- 📱 **Mobile-First** – Tampilan optimal di HP, tablet, dan PC

### Untuk Admin

- 🔐 **Login Aman** – Authentikasi via Supabase
- 📊 **Dashboard** – Statistik produk, kategori, & quick actions
- ➕ **Kelola Produk** – Tambah, edit, hapus, toggle aktif/unggulan, upload hingga 5 foto per produk
- 🏷️ **Kelola Kategori** – Inline edit dengan urutan tampil
- ⚙️ **Pengaturan Toko** – Atur nama, tagline, deskripsi, kontak WhatsApp, alamat, jam, template pesan WA
- 🎨 **UI Minimalis** – Sidebar yang clean, mobile drawer, semua dalam Bahasa Indonesia

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | **Next.js 14** (App Router) |
| Bahasa | **TypeScript** |
| Styling | **Tailwind CSS** |
| Database | **Supabase** (PostgreSQL) |
| Authentication | **Supabase Auth** |
| Storage Foto | **Supabase Storage** |
| Hosting | **Vercel** (free tier) |
| WhatsApp | Link `wa.me` (gratis, tanpa API) |

## 📁 Struktur Folder

```
dzawata-trophy/
├── public/                         # Logo & gambar statis
│   ├── logo.png                    # Logo utama (badge bulat hitam-emas)
│   ├── logo-512.png, logo-192.png  # Versi PWA / app icon
│   ├── favicon.ico, favicon-32.png # Favicon
│   ├── apple-touch-icon.png        # iOS home screen
│   └── og-image.png                # Open Graph preview
├── src/
│   ├── app/
│   │   ├── (public)/               # Halaman publik (dengan Navbar/Footer)
│   │   │   ├── page.tsx            # Beranda
│   │   │   ├── katalog/page.tsx    # Daftar produk
│   │   │   ├── katalog/[slug]/     # Detail produk
│   │   │   ├── tentang/page.tsx    # Tentang Kami
│   │   │   └── layout.tsx
│   │   ├── admin/
│   │   │   ├── login/page.tsx      # Halaman login (tanpa sidebar)
│   │   │   ├── (dashboard)/        # Halaman admin (dengan sidebar)
│   │   │   │   ├── layout.tsx      # Sidebar layout
│   │   │   │   ├── page.tsx        # Dashboard
│   │   │   │   ├── produk/         # CRUD produk
│   │   │   │   ├── kategori/       # CRUD kategori
│   │   │   │   └── pengaturan/     # Pengaturan toko
│   │   │   └── actions.ts          # Server Actions
│   │   ├── auth/signout/route.ts   # Logout endpoint
│   │   ├── layout.tsx              # Root layout + metadata
│   │   ├── globals.css             # Tailwind + custom CSS
│   │   └── not-found.tsx           # 404
│   ├── components/                 # Komponen UI publik
│   │   ├── admin/                  # Komponen UI admin
│   │   ├── Logo.tsx, Navbar.tsx, Footer.tsx, ...
│   │   └── ProductCard.tsx, ProductGallery.tsx, ...
│   ├── lib/
│   │   ├── supabase/               # Supabase clients (browser/server/middleware)
│   │   ├── types.ts                # Type definitions
│   │   ├── utils.ts                # formatRupiah, slugify, dll
│   │   └── whatsapp.ts             # buildWhatsAppUrl
│   └── middleware.ts               # Proteksi route /admin/*
├── supabase/
│   └── schema.sql                  # 🔥 SQL untuk setup database
├── .env.local.example              # Template env vars
├── next.config.js, tailwind.config.ts, tsconfig.json
└── package.json
```

## 🚀 Quick Start

### Prasyarat

- **Node.js** 18.17+ atau 20+
- Akun **Supabase** (gratis di [supabase.com](https://supabase.com))
- Akun **Vercel** (gratis di [vercel.com](https://vercel.com)) untuk deploy

### Setup Lokal

```bash
# 1. Install dependencies
npm install

# 2. Salin .env.local.example menjadi .env.local
cp .env.local.example .env.local

# 3. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY
#    (lihat PANDUAN_DEPLOY.md untuk detail)

# 4. Jalankan di mode dev
npm run dev

# 5. Buka http://localhost:3000
```

## 🚢 Deploy ke Vercel

📖 **Baca panduan lengkap di [`PANDUAN_DEPLOY.md`](./PANDUAN_DEPLOY.md)** — ada step-by-step dengan screenshot mental untuk pemilik toko yang non-technical.

Ringkasan singkat:

1. **Setup Supabase** – Buat project → jalankan `supabase/schema.sql` di SQL Editor → buat user admin
2. **Push ke GitHub** – Upload kode ke repo
3. **Deploy ke Vercel** – Import repo + masukkan env vars
4. **Selesai** – Buka URL Vercel, akses `/admin/login` untuk masuk panel admin

## 📝 Skema Database

4 tabel utama:

- **`kategori`** – Daftar kategori produk (Piala, Plakat, Medali, dll)
- **`produk`** – Data produk dengan harga, deskripsi, status aktif/unggulan
- **`foto_produk`** – Foto-foto produk (1 produk → max 5 foto)
- **`pengaturan_toko`** – Singleton row dengan info toko (nama, kontak, jam, dll)

Plus **storage bucket** `produk-foto` untuk file gambar.

Semua sudah ada di `supabase/schema.sql` dengan **Row Level Security (RLS)** yang benar.

## 🔒 Keamanan

- ✅ Public hanya bisa **membaca** produk yang `is_aktif = true`
- ✅ Admin (authenticated) bisa **CRUD** semuanya
- ✅ Storage bucket public-readable, write hanya untuk authenticated
- ✅ Middleware otomatis redirect ke `/admin/login` jika belum login
- ✅ Cookie-based session via Supabase SSR
- ✅ `noindex` di semua halaman admin

## 📱 Optimasi Mobile

- Mobile-first design — break dari `sm` (640px), `md` (768px), `lg` (1024px)
- Hamburger menu di mobile untuk Navbar & Sidebar
- Touch-friendly button (min 44x44px)
- Image gallery dengan navigasi prev/next
- Filter kategori horizontal scroll
- Fixed WhatsApp button + sticky CTA pesan di detail produk

## 🎨 Brand & Design

- **Primary**: Navy `#1B376D` — header, judul, tombol primary
- **Accent**: Gold `#C99A06` — highlight, harga, CTA penting
- **Background**: Off-white cream `#F8F9FA`
- **Display Font**: Cormorant Garamond (heading)
- **Body Font**: Plus Jakarta Sans
- **ISR caching**: 30–60 detik agar update produk cepat tampil

## 🔧 NPM Scripts

```bash
npm run dev          # Mode development
npm run build        # Build produksi
npm run start        # Jalankan hasil build
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

## 📞 Bantuan

Jika ada masalah saat setup atau deploy, baca **[PANDUAN_DEPLOY.md](./PANDUAN_DEPLOY.md)** terlebih dahulu — ada troubleshooting di bagian bawah.

---

Made with ❤️ for **Dzawata Trophy**
