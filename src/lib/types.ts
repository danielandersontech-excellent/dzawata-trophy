export type Kategori = {
  id: string;
  nama: string;
  slug: string;
  urutan: number;
  created_at: string;
};

export type FotoProduk = {
  id: string;
  produk_id: string;
  url: string;
  storage_path: string | null;
  urutan: number;
  created_at: string;
};

export type Produk = {
  id: string;
  nama: string;
  slug: string;
  deskripsi: string | null;
  harga_mulai: number;
  kategori_id: string | null;
  is_aktif: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type ProdukWithRelations = Produk & {
  kategori: Kategori | null;
  foto_produk: FotoProduk[];
};

export type PengaturanToko = {
  id: number;
  nama_toko: string;
  tagline: string | null;
  deskripsi: string | null;
  nomor_wa: string | null;
  pesan_wa_default: string | null;
  alamat: string | null;
  jam_operasional: string | null;
  email: string | null;
  google_maps_url: string | null;
  updated_at: string;
};
