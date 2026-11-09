import { CompanyAdvantage} from './types';

export const BUSINESS_INFO = {
  name: "Tani Makmur Bersama",
  shortName: "Tani Makmur",
  tagline: "Sahabat Petani Sejak Awal",
  headline: "Distributor pestisida, insektisida, herbisida, dan peralatan pengendali hama terlengkap di Indonesia.",
  phone: "+62 815-5071-697",
  whatsappUrl: "https://wa.me/628155071697",
  shopeeUrl1: "https://id.shp.ee/38zfZhP",
  shopeeUrl2: "https://id.shp.ee/yu6j9V2",
  lazadaUrl: "https://lazada.co.id/shop/tani-makmur-bersama-tmb",
  tokopediaUrl: "https://www.tokopedia.com",
  // Isi link toko resmi di bawah ini. Bila kosong, kartu tampil "Segera hadir".
  tiktokShopUrl: "",
  blibliUrl: "",
  instagramUrl: "https://www.instagram.com",
  email: "tmb.pestcontrol@gmail.com",
  address: "Denpasar, Bali, Indonesia",
  fullAddress: "Jl. Pabean Asri Jl. Ferrari No.25 BLOK W, Pabean, Kec. Sedati, Kab Sidoarjo, 61253, Jawa Timur",
  hours: "Senin - Sabtu, 08:00 - 17:00",
  stats: [
    { value: "500+", label: "Produk Tersedia" },
    { value: "10K+", label: "Pelanggan Aktif" },
    { value: "34", label: "Provinsi Terlayani" }
  ]
};

export const ADVANTAGES: CompanyAdvantage[] = [
  {
    id: 1,
    title: "Pestisida",
    description: "Mengatasi hama tanaman dengan perlindungan maksimal.",
    iconName: "ShieldCheck"
  },
  {
    id: 2,
    title: "Insektisida",
    description: "Membasmi serangga pengganggu secara efektif.",
    iconName: "Sparkles"
  },
  {
    id: 3,
    title: "Herbisida",
    description: "Mengendalikan gulma untuk meningkatkan hasil panen.",
    iconName: "TrendingDown"
  },
  {
    id: 4,
    title: "Peralatan Pengendali Hama",
    description: "Alat berkualitas tinggi untuk pengendalian hama yang optimal.",
    iconName: "ShoppingBag"
  }
];


// Kategori produk. `name` harus sama persis dengan kolom `category` di Supabase.
export const CATEGORIES = [
  { name: 'PEMBASMI HAMA GUDANG', label: 'Hama Gudang', desc: 'Lindungi stok & hasil panen', color: '#166534' },
  { name: 'PEMBASMI NYAMUK LALAT', label: 'Nyamuk & Lalat', desc: 'Insektisida & fogging', color: '#0f3d22' },
  { name: 'PEMBASMI RAYAP', label: 'Rayap', desc: 'Termitisida bangunan', color: '#9a3412' },
  { name: 'PEMBASMI TIKUS', label: 'Tikus', desc: 'Rodentisida & umpan', color: '#1f2937' },
  { name: 'ALAT PEMBASMI HAMA', label: 'Alat Pengendali', desc: 'Sprayer, fogging & perangkap', color: '#ea580c' },
];

export const ANNOUNCEMENTS = [
  'Pengiriman ke seluruh Indonesia',
  'Produk resmi & terdaftar',
  'Konsultasi hama gratis via WhatsApp',
  'Harga khusus pembelian grosir',
];

export const formatRupiah = (value: number) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

export type StoreLogo = 'whatsapp' | 'shopee' | 'tiktok' | 'tokopedia' | 'lazada' | 'blibli';

// Daftar official store yang tampil di halaman /official-store
export const OFFICIAL_STORES: { logo: StoreLogo; name: string; note?: string; url: string }[] = [
  { logo: 'whatsapp', name: 'WhatsApp', note: 'Pesan langsung', url: BUSINESS_INFO.whatsappUrl },
  { logo: 'shopee', name: 'Shopee', note: 'Toko 1', url: BUSINESS_INFO.shopeeUrl1 },
  { logo: 'shopee', name: 'Shopee', note: 'Toko 2', url: BUSINESS_INFO.shopeeUrl2 },
  { logo: 'tiktok', name: 'TikTok Shop', url: BUSINESS_INFO.tiktokShopUrl },
  { logo: 'tokopedia', name: 'Tokopedia', url: BUSINESS_INFO.tokopediaUrl },
  { logo: 'lazada', name: 'Lazada', url: BUSINESS_INFO.lazadaUrl },
  { logo: 'blibli', name: 'Blibli', url: BUSINESS_INFO.blibliUrl },
];
