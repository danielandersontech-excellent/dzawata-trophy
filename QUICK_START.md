# 🚀 QUICK START — Dzawata Trophy

> **Versi ini sudah diperbaiki** dengan semua bug fix & logo transparan.
> Ikuti panduan ini untuk pertama kali. Untuk deploy ke internet, lihat `PANDUAN_DEPLOY.md`.

---

## ⚡ Jalankan di Laptop Anda (Lokal)

### 1. Install Node.js (kalau belum punya)

Download dari **https://nodejs.org/** — pilih versi **LTS** (yang ada tulisan "Recommended For Most Users"). Install seperti aplikasi biasa.

Verifikasi dengan buka **Command Prompt** (Windows) / **Terminal** (Mac/Linux):
```bash
node --version
```
Harus muncul angka `v20.x.x` atau lebih tinggi.

### 2. Buka Folder Project di Terminal

1. Extract file `dzawata-trophy.zip` di folder pilihan Anda (misal Desktop)
2. Masuk ke folder hasil extract `dzawata-trophy/`
3. **Shift + Klik Kanan** di area kosong dalam folder → "Open in Terminal" / "Open PowerShell window here"
   - Atau buka Terminal manual lalu `cd` ke folder ini

### 3. Setup Supabase (Database)

Karena project ini butuh database, Anda harus setup Supabase dulu (gratis, ~10 menit).

**Ringkas:**
1. Daftar di https://supabase.com (gratis)
2. New Project → kasih nama "dzawata-trophy" → tunggu ~2 menit
3. Project Settings → API → copy 2 nilai:
   - **Project URL** (https://xxx.supabase.co)
   - **anon public key** (string panjang `eyJ...`)
4. SQL Editor → New Query → paste SEMUA isi file `supabase/schema.sql` dari project ini → Run
5. Authentication → Users → Add User → masukkan email & password admin
6. Authentication → Providers → Email → matikan "Confirm email" (supaya tidak perlu konfirmasi email)

> Detail lengkap dengan screenshot ada di `PANDUAN_DEPLOY.md` bagian 2 & 3.

### 4. Buat File .env.local

Di dalam folder project, ada file `.env.local.example`. **Copy** menjadi `.env.local`:

- **Windows (Command Prompt)**: `copy .env.local.example .env.local`
- **Mac/Linux**: `cp .env.local.example .env.local`

Buka `.env.local` dengan Notepad / VS Code, isi 2 nilai dari Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
```

### 5. Install Dependencies & Jalankan

Di Terminal yang sudah berada di folder project:

```bash
npm install
```
Tunggu 1–3 menit (download paket-paket).

```bash
npm run dev
```

Kalau berhasil, akan muncul:
```
▲ Next.js 14.2.18
- Local:        http://localhost:3000
✓ Ready in X.Xs
```

### 6. Buka di Browser

- 🌐 **Website publik:** http://localhost:3000
- 🔐 **Login admin:** http://localhost:3000/admin/login

Login pakai email & password yang Anda buat di Supabase di langkah 3.

---

## 🐛 Troubleshooting

| Error | Solusi |
|---|---|
| `'npm' is not recognized` (Windows) | Node.js belum keinstall, atau Terminal belum di-restart setelah install |
| `Cannot find module ...` | `npm install` belum kelar / gagal. Jalankan ulang. Cek koneksi internet. |
| Halaman blank, error console "Invalid URL" | `.env.local` belum diisi atau formatnya salah (jangan ada tanda kutip!) |
| Login berhasil tapi langsung balik ke login lagi | Schema SQL belum di-run di Supabase, atau Cookie di-block browser |
| Foto tidak ke-upload | Storage bucket `produk-foto` belum dibuat — pastikan SECTION 7 di `supabase/schema.sql` ke-execute |
| Port 3000 sudah dipakai | Jalankan `npm run dev -- -p 3001` (atau port lain) |

---

## ☁️ Untuk Deploy ke Internet (Live)

Setelah berhasil jalan di lokal, baca **`PANDUAN_DEPLOY.md`** untuk:
- Upload ke GitHub
- Deploy ke Vercel (gratis)
- Hubungkan custom domain

Estimasi 30–45 menit kalau ikut step-by-step.

---

## 📋 Apa Yang Diperbaiki di Versi Ini

Lihat `PATCH_NOTES.md` untuk detail teknis. Singkatnya:

1. ✅ **Bug runtime** di halaman daftar produk admin (versi sebelumnya akan crash saat klik toggle/hapus)
2. ✅ **Race condition** di upload foto produk (kadang foto hilang saat dipilih cepat-cepat)
3. ✅ **Memory leak** di image preview
4. ✅ **Logo dengan kotak hitam** di Navbar, Hero, Footer, Sidebar admin, halaman login
5. ✅ **Search admin** rentan terhadap karakter `,` `'` `"` — sudah di-escape
6. ✅ Logo `public/logo.png` & `public/logo-transparent.png` diganti versi yang **benar-benar transparan** (yang lama itu sebenarnya RGB tanpa alpha channel)

---

*Selamat menjalankan! Kalau stuck, copy pesan errornya ke chat.*
