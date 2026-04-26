# 📘 Panduan Deploy Dzawata Trophy

Panduan lengkap untuk **menjalankan website Dzawata Trophy dari nol sampai online di internet**, ditujukan untuk **pemilik toko yang tidak punya background teknis**.

Estimasi waktu: **30–45 menit** untuk pertama kali.

---

## 📋 Daftar Isi

1. [Yang Perlu Disiapkan](#1-yang-perlu-disiapkan)
2. [Setup Supabase (Database & Login)](#2-setup-supabase-database--login)
3. [Buat Akun Admin](#3-buat-akun-admin)
4. [Upload Kode ke GitHub](#4-upload-kode-ke-github)
5. [Deploy ke Vercel](#5-deploy-ke-vercel)
6. [Custom Domain (Opsional)](#6-custom-domain-opsional)
7. [Cara Pakai Panel Admin](#7-cara-pakai-panel-admin)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Yang Perlu Disiapkan

✅ **Akun Email** (Gmail/lainnya) — untuk register Supabase, Vercel, GitHub

✅ **Foto-foto produk** — JPG/PNG/WebP, maks 5 MB per foto

✅ **Nomor WhatsApp toko** — dengan/tanpa kode negara, contoh: `081234567890` atau `6281234567890`

✅ **Komputer dengan internet** — bisa Windows/Mac/Linux

❌ **TIDAK perlu** — kartu kredit, software berbayar, kemampuan coding

---

## 2. Setup Supabase (Database & Login)

Supabase = layanan gratis untuk menyimpan data produk, foto, dan login admin Anda.

### Step 2.1 — Daftar Supabase

1. Buka [https://supabase.com](https://supabase.com)
2. Klik **"Start your project"** → daftar pakai GitHub atau email
3. Verifikasi email jika diminta

### Step 2.2 — Buat Project Baru

1. Setelah login, klik **"New Project"**
2. Isi:
   - **Name**: `dzawata-trophy` (bebas)
   - **Database Password**: 🔥 **buat password kuat & SIMPAN!** Anda perlu password ini kalau lupa nanti.
   - **Region**: pilih `Southeast Asia (Singapore)` — paling cepat untuk user di Indonesia
3. Klik **"Create new project"** → tunggu 1–2 menit sampai status hijau

### Step 2.3 — Jalankan Schema Database

1. Di dashboard Supabase, klik menu **"SQL Editor"** di sidebar kiri
2. Klik **"+ New query"**
3. Buka file **`supabase/schema.sql`** di folder kode Anda — copy SELURUH ISINYA
4. Paste ke SQL Editor di Supabase
5. Klik tombol **"RUN"** (atau tekan Ctrl+Enter / Cmd+Enter)
6. Tunggu beberapa detik — kalau berhasil akan muncul "Success. No rows returned" ✅

> 💡 Jika muncul error "extension uuid-ossp already exists" atau sejenisnya, abaikan — itu artinya sudah pernah dijalankan.

Schema ini akan membuat 4 tabel + storage bucket + permissions secara otomatis.

### Step 2.4 — Ambil URL & API Key

Anda butuh dua nilai untuk dipasang ke Vercel nanti.

1. Di dashboard Supabase, klik menu **"Project Settings"** (icon gear ⚙️ di sidebar bawah) → **"API"**
2. Catat dua nilai ini di Notepad/Notes:

| Yang dibutuhkan | Letaknya di Supabase |
|---|---|
| **Project URL** | Bagian "Project URL" — contoh: `https://abcdxxxx.supabase.co` |
| **anon public key** | Bagian "Project API keys" → copy nilai di kolom **`anon`** **`public`** (yang panjang banget) |

> ⚠️ JANGAN copy "service_role" key — itu rahasia dan tidak boleh dipasang di frontend.

---

## 3. Buat Akun Admin

Untuk bisa login ke panel admin website Anda.

1. Di dashboard Supabase, klik **"Authentication"** di sidebar
2. Klik tab **"Users"**
3. Klik tombol **"+ Add user"** → **"Create new user"**
4. Isi:
   - **Email**: misal `admin@dzawatatrophy.com` (boleh email apa saja)
   - **Password**: buat password kuat 🔒
   - **Auto Confirm User**: ✅ **CENTANG** (penting! biar bisa langsung login tanpa verifikasi email)
5. Klik **"Create user"**

✅ Email + password ini = akun untuk login ke `/admin/login` di website nanti.

---

## 4. Upload Kode ke GitHub

GitHub = tempat menyimpan kode online, gratis, dan terhubung dengan Vercel.

### Step 4.1 — Daftar GitHub

1. Buka [https://github.com](https://github.com) → klik **"Sign up"**
2. Daftar dengan email & verifikasi

### Step 4.2 — Upload Kode (Cara Paling Mudah, Tanpa Git)

1. Setelah login GitHub, klik tombol **"+"** di pojok kanan atas → **"New repository"**
2. Isi:
   - **Repository name**: `dzawata-trophy`
   - **Public** atau **Private**: pilih **Private** (lebih aman)
   - **JANGAN** centang "Add a README"
3. Klik **"Create repository"**
4. Di halaman repo kosong yang muncul, klik link **"uploading an existing file"**
5. **Drag & drop SELURUH ISI folder `dzawata-trophy/`** ke browser (jangan folder utamanya, tapi isinya — `src/`, `public/`, `package.json`, dst)
   - **PENTING**: Jangan upload folder `node_modules/` (kalau ada) — terlalu besar dan tidak perlu
   - Jangan upload file `.env.local` jika ada
6. Tulis pesan commit: `Initial commit`
7. Klik **"Commit changes"**
8. Tunggu upload selesai

> 💡 Kalau Anda familiar Git/Terminal, bisa pakai cara biasa: `git init`, `git add .`, `git commit`, `git remote add`, `git push`.

---

## 5. Deploy ke Vercel

Vercel = layanan gratis untuk hosting website Next.js. Sudah otomatis nyambung dengan GitHub.

### Step 5.1 — Daftar Vercel

1. Buka [https://vercel.com](https://vercel.com) → **"Sign Up"**
2. **Pilih "Continue with GitHub"** (paling mudah, otomatis terhubung)
3. Authorize Vercel untuk akses GitHub Anda

### Step 5.2 — Import Project

1. Di dashboard Vercel, klik **"Add New..."** → **"Project"**
2. Cari repository `dzawata-trophy` di daftar → klik **"Import"**
3. Vercel akan auto-detect bahwa ini Next.js — biarkan setting default

### Step 5.3 — Pasang Environment Variables (PENTING!)

Sebelum klik Deploy, scroll ke bagian **"Environment Variables"** dan tambahkan **3 variabel** ini:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL dari Supabase (Step 2.4) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key dari Supabase (Step 2.4) |
| `NEXT_PUBLIC_SITE_URL` | Kosongkan dulu, akan diisi setelah deploy |

Cara tambah:
- Ketik nama di kolom "Key"
- Paste nilai di kolom "Value"
- Klik **"Add"**
- Ulangi untuk semua

### Step 5.4 — Deploy!

1. Klik tombol besar **"Deploy"**
2. Tunggu 1–3 menit sampai muncul layar konfirmasi (ada animasi confetti 🎉)
3. Klik **"Continue to Dashboard"** atau **"Visit"**

✅ Website Anda sudah online! URL-nya seperti `https://dzawata-trophy-xxx.vercel.app`

### Step 5.5 — Update NEXT_PUBLIC_SITE_URL

1. Copy URL Vercel Anda dari dashboard
2. Di Vercel, masuk **Project → Settings → Environment Variables**
3. Edit `NEXT_PUBLIC_SITE_URL` → isi dengan URL Vercel (contoh: `https://dzawata-trophy.vercel.app`)
4. Save → klik **"Deployments"** di tab atas → klik tombol **"⋯"** di deployment terakhir → **"Redeploy"**

---

## 6. Custom Domain (Opsional)

Kalau Anda punya domain sendiri (misal `dzawatatrophy.com`):

1. Di Vercel, masuk **Project → Settings → Domains**
2. Klik **"Add"** → ketik domain Anda
3. Vercel akan kasih instruksi DNS — biasanya tambahkan record `A` ke `76.76.21.21` atau `CNAME` ke `cname.vercel-dns.com`
4. Update DNS di provider domain Anda (Niagahoster, RumahWeb, Cloudflare, dll)
5. Tunggu propagasi DNS (5 menit – 24 jam)
6. Vercel otomatis pasang SSL https — gratis
7. Update `NEXT_PUBLIC_SITE_URL` di env vars dengan domain baru, lalu Redeploy

---

## 7. Cara Pakai Panel Admin

### Login

1. Buka URL website + `/admin/login` — contoh: `https://dzawatatrophy.vercel.app/admin/login`
2. Masukkan email & password admin (yang dibuat di Step 3)
3. Klik **"Masuk"** → masuk ke Dashboard

### Atur Pengaturan Toko (Lakukan PERTAMA)

1. Klik **"Pengaturan"** di sidebar
2. Lengkapi:
   - **Nama Toko**: `Dzawata Trophy`
   - **Tagline**: tagline singkat
   - **Deskripsi Toko**: paragraf tentang toko Anda
   - **Nomor WhatsApp**: nomor toko (`08xxx` atau `628xxx`)
   - **Template Pesan WhatsApp**: pesan yang otomatis terkirim saat customer klik tombol pesan, contoh:
     ```
     Halo {nama_toko}, saya tertarik dengan {nama_produk} ({kategori}). Bisa info lebih lanjut?
     ```
   - **Alamat**, **Jam Operasional**, **Email**, **Link Google Maps** (opsional)
3. Klik **"Simpan Pengaturan"**

### Tambah Kategori

1. Klik **"Kategori"** di sidebar
2. Isi nama (`Piala`, `Plakat`, `Medali`, dst) → klik **"Tambah"**
3. Default sudah ada beberapa kategori dari schema, edit/hapus sesuai kebutuhan

### Tambah Produk

1. Klik **"Produk"** → **"Tambah Produk"**
2. Isi:
   - **Nama Produk**: misal "Piala Akrilik 25cm"
   - **Kategori**: pilih dari dropdown
   - **Harga Mulai**: angka rupiah (isi `0` jika ingin tampil "Hubungi Kami")
   - **Deskripsi**: detail produk, bahan, ukuran, dll
   - **Aktif**: ✅ centang biar tampil di website
   - **Unggulan**: centang kalau mau muncul di beranda
3. **Upload foto** — bisa pilih hingga 5 foto sekaligus, foto pertama jadi cover
4. Klik **"Tambah Produk"**

### Edit / Hapus Produk

- Di daftar produk, klik **"Edit"** atau ikon 🗑️
- Untuk hapus, klik tombol Hapus 2x (klik pertama untuk konfirmasi, klik kedua untuk eksekusi)

### Logout

Klik **"Keluar"** di pojok kiri bawah sidebar.

---

## 8. Troubleshooting

### ❌ "Build failed" di Vercel

- Cek **Vercel → Deployments → klik deployment yang gagal → View Build Logs**
- Pastikan environment variables sudah dipasang dengan benar
- Cek typo di nama variable (huruf kapital harus tepat: `NEXT_PUBLIC_SUPABASE_URL`)

### ❌ Tidak bisa login admin

- Pastikan saat membuat user di Supabase, **"Auto Confirm User"** sudah ✅ centang
- Cek email & password tepat (case-sensitive)
- Buka kembali Supabase → Authentication → Users → user Anda harus ada dengan status "Confirmed"

### ❌ Foto tidak tampil

- Cek di Supabase → **Storage** → bucket `produk-foto` harus ada dan **Public** = true
- Pastikan tombol "Public bucket" sudah ON saat upload
- Cek Console browser (F12) untuk error CORS — biasanya karena bucket belum public

### ❌ "Failed to fetch" / data tidak muncul

- Cek environment variables di Vercel — pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` benar
- Cek di Supabase → SQL Editor → jalankan query: `SELECT * FROM produk;` — kalau error berarti schema belum dijalankan
- Setelah ubah env vars di Vercel, harus **Redeploy** ulang!

### ❌ Tombol WhatsApp error

- Pastikan **Nomor WhatsApp** sudah diisi di Pengaturan
- Format nomor: `08xxx` atau `62xxx` (boleh tanpa `+`)

### ❌ Halaman 404 di /katalog/[slug]

- Pastikan produk dalam status **Aktif** (toggle di kolom Status)
- Cek slug di URL — slug otomatis dibuat dari nama produk

### ❌ Update produk tidak tampil di website

- Tunggu 30–60 detik (ada cache ISR)
- Refresh halaman dengan Ctrl+F5 / Cmd+Shift+R untuk hard refresh
- Kalau perlu langsung tampil, login ke Vercel → Deployments → Redeploy

### 💬 Butuh bantuan lebih lanjut?

- **Vercel docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

## 🎉 Selamat!

Website Dzawata Trophy Anda sudah online dan siap digunakan!

**Tips selanjutnya:**

- 🔄 Setiap kali update kode di GitHub, Vercel otomatis re-deploy
- 📊 Pantau analitik gratis di Vercel → Analytics
- 📱 Bagikan link website di Instagram, Facebook, dan WhatsApp Business
- 🔍 Daftarkan ke Google Search Console biar muncul di pencarian
- 🌟 Update produk rutin biar customer aware ada item baru

Sukses untuk bisnisnya! 🏆
