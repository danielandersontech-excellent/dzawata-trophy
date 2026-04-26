# 🔧 Patch Notes — Dzawata Trophy

Dokumen ini menjelaskan perubahan teknis yang dilakukan dari versi awal ke versi saat ini. Untuk panduan jalankan project, baca `QUICK_START.md`.

---

## 🐛 Bug Kritis yang Diperbaiki

### Bug #1 — Server action passing ke Client Component (CRASH di runtime)

**File yang error:** `src/app/admin/(dashboard)/produk/page.tsx`

```tsx
// ❌ YANG LAMA (BUG):
// File ini Server Component (tidak ada 'use client')
<ToggleStatus
  onToggle={async () => toggleProdukAktif(p.id, p.is_aktif)} // ← Function pass dari Server ke Client → ERROR
/>
<DeleteButton
  onConfirm={async () => deleteProduk(p.id)} // ← Sama errornya
/>
```

Next.js akan throw error di runtime: **"Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with 'use server'"**.

**Perbaikan:** Dibuat Client Component baru `ProdukTableRow.tsx` yang membungkus seluruh `<tr>`. Closure dibuat di Client Component, jadi server action di-import langsung dan dipanggil dengan parameter dari closure — pola yang valid di Next.js 14.

### Bug #2 — Race condition di ImageUploader

**File:** `src/components/admin/ImageUploader.tsx`

```tsx
// ❌ YANG LAMA (BUG):
setPreviews(prev => [...prev, ...newPreviews]);    // setState async
syncInputFiles([...previews, ...newPreviews]);     // 'previews' di sini masih versi LAMA
```

Akibat: file kadang hilang dari FormData karena `previews` masih old state saat `syncInputFiles` dipanggil. Juga ada **memory leak** karena `URL.createObjectURL` tidak pernah di-revoke saat unmount.

**Perbaikan:**
- Sync `<input type="file">` dilakukan di `useEffect([previews])` — jalan setelah state sudah update
- Cleanup `URL.revokeObjectURL` di unmount via `useEffect(() => return () => ...)`
- Reset `inputRef.current.value = ''` setelah pilih file → user bisa pilih file yang sama lagi
- Tambah prop `unoptimized` di `<Image>` preview karena `blob:` URL tidak bisa di-optimize Next.js

### Bug #3 — Logo dengan latar belakang hitam

**Diagnosis dengan PIL/Pillow:**

| File | Mode | Format Asli | Status |
|---|---|---|---|
| `dzawata_logo_real.png` (yang dikirim penjual) | RGB | **JPEG** (bukan PNG!) | Tidak bisa transparan |
| `public/logo.png` (di project original) | RGB | PNG | RGB tanpa alpha — kotak hitam pekat |
| `public/logo-transparent.png` (di project original) | RGBA | PNG | ✅ Sudah transparan |

JPEG **secara teknis tidak punya alpha channel** — mustahil transparan. Penjual mungkin: (a) pakai aplikasi remove-bg lalu salah save sebagai JPEG, (b) screenshot dari preview HP dark mode, atau (c) export ulang ke canvas hitam.

**Perbaikan:**
- Semua referensi `/logo.png` di komponen yang ditampilkan **di atas latar berwarna** sekarang pakai `/logo-transparent.png`:
  - `Logo.tsx` (dipakai Navbar + Footer)
  - `HeroSection.tsx` (latar navy gradient)
  - `AdminSidebar.tsx` (latar navy)
  - `app/admin/login/page.tsx` (latar navy gradient)
- File `public/logo.png` & `public/logo-transparent.png` diganti dengan **logo transparan baru yang di-generate dari logo asli dzawata_logo_real.png**, dengan threshold algorithm di Pillow (deteksi pixel hampir-hitam → set alpha=0). Ukuran 800×800, RGBA, alpha range 0–255.
- Hapus workaround `bg-white inline-block px-4 py-2.5 rounded-lg` di Footer (tidak diperlukan lagi karena logo sudah transparan)
- Hapus `className="rounded-md"` di AdminSidebar logo (badge bulat sudah punya bentuk sendiri)

---

## 🟡 Issue Minor yang Juga Diperbaiki

1. **Search di `/admin/produk` rentan inject** — sekarang escape karakter `,` `'` `"` `()` dan limit ke 100 karakter sebelum di-pass ke PostgREST `.or()`
2. **Logo sizing inconsistent** — `Logo.tsx` sekarang prefer `className` jika diberikan, fallback ke `size` jika tidak. Sebelumnya inline `style` selalu override class.
3. **`dynamic = 'force-dynamic'`** ditambahkan ke `produk/page.tsx` agar daftar produk selalu fresh setelah toggle/delete

---

## 📝 Daftar File yang Diubah

| File | Status |
|---|---|
| `src/components/admin/ProdukTableRow.tsx` | ✨ **BARU** |
| `src/app/admin/(dashboard)/produk/page.tsx` | Modified (refactor besar) |
| `src/components/admin/ImageUploader.tsx` | Modified (fix race + leak) |
| `src/components/admin/AdminSidebar.tsx` | Modified (logo transparan) |
| `src/components/Logo.tsx` | Modified (logo transparan + sizing) |
| `src/components/Footer.tsx` | Modified (logo transparan + bersih) |
| `src/components/HeroSection.tsx` | Modified (logo transparan) |
| `src/app/admin/login/page.tsx` | Modified (logo transparan) |
| `public/logo.png` | Replaced (versi transparan) |
| `public/logo-transparent.png` | Replaced (versi yang lebih bersih) |
| `QUICK_START.md` | ✨ **BARU** |
| `PATCH_NOTES.md` | ✨ **BARU** (file ini) |

---

## 🎯 Tentang Logo — Penjelasan untuk Penjual (Jika Perlu)

Jika perlu menjelaskan ke penjual yang kirim logo:

> "File yang dikirim sebenarnya berformat **JPEG** (walaupun ekstensi-nya .png), bukan PNG transparan. JPEG secara teknis **tidak bisa** menyimpan transparansi — pasti ada warna di latar belakangnya (dalam kasus ini hitam). Mohon kirim ulang sebagai **PNG asli dengan alpha channel** dari aplikasi remove background (seperti remove.bg, Photoroom, atau export sebagai PNG dari Photoshop/Figma dengan opsi 'Background: Transparent')."

---

*Dzawata Trophy — Patched Version v1.0 — Apr 2026*
