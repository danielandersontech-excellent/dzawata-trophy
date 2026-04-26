-- =====================================================
-- DZAWATA TROPHY - Database Schema
-- Jalankan SEMUA query ini sekaligus di Supabase
-- SQL Editor (Dashboard > SQL Editor > New Query)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABEL: kategori
-- =====================================================
CREATE TABLE IF NOT EXISTS public.kategori (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama         VARCHAR(100) NOT NULL,
  slug         VARCHAR(100) NOT NULL UNIQUE,
  urutan       INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kategori_urutan ON public.kategori(urutan);

-- =====================================================
-- 2. TABEL: produk
-- =====================================================
CREATE TABLE IF NOT EXISTS public.produk (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama          VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  deskripsi     TEXT,
  harga_mulai   INTEGER NOT NULL DEFAULT 0,
  kategori_id   UUID REFERENCES public.kategori(id) ON DELETE SET NULL,
  is_aktif      BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_produk_kategori ON public.produk(kategori_id);
CREATE INDEX IF NOT EXISTS idx_produk_aktif ON public.produk(is_aktif);
CREATE INDEX IF NOT EXISTS idx_produk_featured ON public.produk(is_featured);
CREATE INDEX IF NOT EXISTS idx_produk_created ON public.produk(created_at DESC);

-- Trigger: auto update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS produk_updated_at ON public.produk;
CREATE TRIGGER produk_updated_at
  BEFORE UPDATE ON public.produk
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- 3. TABEL: foto_produk
-- =====================================================
CREATE TABLE IF NOT EXISTS public.foto_produk (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  produk_id    UUID NOT NULL REFERENCES public.produk(id) ON DELETE CASCADE,
  url          TEXT NOT NULL,
  storage_path TEXT,
  urutan       INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_foto_produk_id ON public.foto_produk(produk_id);
CREATE INDEX IF NOT EXISTS idx_foto_urutan ON public.foto_produk(urutan);

-- =====================================================
-- 4. TABEL: pengaturan_toko (singleton, hanya 1 baris)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.pengaturan_toko (
  id                 INTEGER PRIMARY KEY DEFAULT 1,
  nama_toko          VARCHAR(255) NOT NULL DEFAULT 'Dzawata Trophy',
  tagline            VARCHAR(255) DEFAULT 'Piala, Plakat, Medali & Trofi Berkualitas',
  deskripsi          TEXT,
  nomor_wa           VARCHAR(20) DEFAULT '6281234567890',
  pesan_wa_default   TEXT DEFAULT 'Halo Dzawata Trophy, saya tertarik dengan produk *{nama_produk}* (kategori: {kategori}). Mohon info lebih lanjut. Terima kasih.',
  alamat             TEXT,
  jam_operasional    VARCHAR(255) DEFAULT 'Senin–Sabtu, 08.00–17.00 WIB',
  email              VARCHAR(255),
  google_maps_url    TEXT,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT only_one_row CHECK (id = 1)
);

DROP TRIGGER IF EXISTS pengaturan_updated_at ON public.pengaturan_toko;
CREATE TRIGGER pengaturan_updated_at
  BEFORE UPDATE ON public.pengaturan_toko
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Insert baris default (singleton)
INSERT INTO public.pengaturan_toko (id, nama_toko, tagline, deskripsi)
VALUES (
  1,
  'Dzawata Trophy',
  'Piala, Plakat, Medali & Trofi Berkualitas',
  'Dzawata Trophy adalah penyedia piala, plakat, medali, dan trofi berkualitas untuk berbagai keperluan: penghargaan instansi, lomba sekolah, turnamen olahraga, hingga acara perusahaan. Kami melayani pemesanan dengan custom desain dan finishing premium.'
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 5. SEED DATA: Kategori awal
-- =====================================================
INSERT INTO public.kategori (nama, slug, urutan) VALUES
  ('Piala', 'piala', 1),
  ('Plakat', 'plakat', 2),
  ('Medali', 'medali', 3),
  ('Trofi Akrilik', 'trofi-akrilik', 4),
  ('Plakat Kayu', 'plakat-kayu', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.kategori          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produk            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foto_produk       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengaturan_toko   ENABLE ROW LEVEL SECURITY;

-- Drop policies if re-running
DROP POLICY IF EXISTS "Public dapat membaca kategori"        ON public.kategori;
DROP POLICY IF EXISTS "Admin full access kategori"           ON public.kategori;
DROP POLICY IF EXISTS "Public dapat membaca produk aktif"    ON public.produk;
DROP POLICY IF EXISTS "Admin full access produk"             ON public.produk;
DROP POLICY IF EXISTS "Public dapat membaca foto"            ON public.foto_produk;
DROP POLICY IF EXISTS "Admin full access foto"               ON public.foto_produk;
DROP POLICY IF EXISTS "Public dapat membaca pengaturan"      ON public.pengaturan_toko;
DROP POLICY IF EXISTS "Admin update pengaturan"              ON public.pengaturan_toko;

-- Kategori: public bisa SELECT, admin bisa semua
CREATE POLICY "Public dapat membaca kategori"
  ON public.kategori FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin full access kategori"
  ON public.kategori FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Produk: public hanya yang aktif, admin full
CREATE POLICY "Public dapat membaca produk aktif"
  ON public.produk FOR SELECT
  USING (is_aktif = TRUE);

CREATE POLICY "Admin full access produk"
  ON public.produk FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Foto produk: public bisa SELECT, admin full
CREATE POLICY "Public dapat membaca foto"
  ON public.foto_produk FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin full access foto"
  ON public.foto_produk FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Pengaturan toko: public read, admin update
CREATE POLICY "Public dapat membaca pengaturan"
  ON public.pengaturan_toko FOR SELECT
  USING (TRUE);

CREATE POLICY "Admin update pengaturan"
  ON public.pengaturan_toko FOR UPDATE
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- =====================================================
-- 7. STORAGE BUCKET untuk foto produk
-- =====================================================
-- Buat bucket 'produk-foto' (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('produk-foto', 'produk-foto', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public dapat membaca foto produk"   ON storage.objects;
DROP POLICY IF EXISTS "Admin upload foto produk"           ON storage.objects;
DROP POLICY IF EXISTS "Admin update foto produk"           ON storage.objects;
DROP POLICY IF EXISTS "Admin hapus foto produk"            ON storage.objects;

CREATE POLICY "Public dapat membaca foto produk"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'produk-foto');

CREATE POLICY "Admin upload foto produk"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'produk-foto');

CREATE POLICY "Admin update foto produk"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'produk-foto');

CREATE POLICY "Admin hapus foto produk"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'produk-foto');

-- =====================================================
-- SELESAI ✅
-- =====================================================
-- Setelah ini:
-- 1. Buka Supabase > Authentication > Users > Add User
--    untuk membuat akun admin (email + password)
-- 2. Pasang env vars di Vercel / .env.local
-- 3. Mulai jalankan website
-- =====================================================
