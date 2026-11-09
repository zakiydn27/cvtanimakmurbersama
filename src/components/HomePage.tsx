import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, MessageCircle, BadgePercent } from 'lucide-react';
import heroBg from '../assets/images/hero_background_1781083617747.png';
import { BUSINESS_INFO, CATEGORIES, OFFICIAL_STORES } from '../data';
import { useProducts } from '../hooks/useProducts';
import { useArticles } from '../hooks/useArticles';
import { categoryPath, linkProps } from '../router';
import { Product } from '../types';
import ProductCard, { ProductCardSkeleton } from './ProductCard';
import { MarketplaceLogo } from './OfficialStorePage';

const firstImageOf = (products: Product[], category: string) =>
  products.find((p) => p.category === category && p.image)?.image;

/* ---------------- Hero slider ---------------- */

function HeroSlider({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = [
    {
      key: 'utama',
      eyebrow: BUSINESS_INFO.tagline,
      title: ['Bebas Gangguan', 'Hama'],
      text: BUSINESS_INFO.headline,
      cta: { label: 'Belanja Sekarang', path: '/produk' },
      image: heroBg,
      bg: '#0f3d22',
      cover: true,
    },
    {
      key: 'rayap',
      eyebrow: 'Kategori Pilihan',
      title: ['Basmi Rayap', '& Tikus Tuntas'],
      text: 'Termitisida dan rodentisida terdaftar untuk rumah, gudang, dan lahan pertanian.',
      cta: { label: 'Lihat Produk', path: categoryPath('PEMBASMI RAYAP') },
      image: firstImageOf(products, 'PEMBASMI RAYAP') || firstImageOf(products, 'PEMBASMI TIKUS'),
      bg: '#166534',
    },
    {
      key: 'grosir',
      eyebrow: 'Untuk Petani & Pest Control',
      title: ['Harga Grosir', 'Langsung Distributor'],
      text: 'Pembelian partai besar? Konsultasikan kebutuhan Anda dan dapatkan penawaran terbaik.',
      cta: { label: 'Chat WhatsApp', href: BUSINESS_INFO.whatsappUrl },
      image: firstImageOf(products, 'ALAT PEMBASMI HAMA') || firstImageOf(products, 'PEMBASMI NYAMUK LALAT'),
      bg: '#c2410c',
    },
  ];

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const slide = slides[index];
  const go = (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <section
      className="relative h-[560px] overflow-hidden text-white sm:h-[600px] lg:h-[640px]"
      style={{ backgroundColor: slide.bg }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{ backgroundColor: slide.bg }}
        >
          {slide.cover ? (
            <>
              <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
            </>
          ) : (
            slide.image && (
              <div className="absolute inset-y-0 right-0 hidden w-1/2 items-center justify-center md:flex">
                <div className="absolute h-[420px] w-[420px] rounded-full bg-white/10" />
                <img
                  src={slide.image}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="relative max-h-[380px] max-w-[380px] object-contain drop-shadow-2xl"
                />
              </div>
            )
          )}

          <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="max-w-xl space-y-5"
            >
              <span className="inline-block border border-white/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em]">
                {slide.eyebrow}
              </span>
              <h1 className="font-heading text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                {slide.title[0]}
                <br />
                <span className="text-accent" style={slide.bg === '#c2410c' ? { color: '#fde68a' } : undefined}>
                  {slide.title[1]}
                </span>
              </h1>
              <p className="max-w-md text-base leading-relaxed text-white/85 sm:text-lg">{slide.text}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                {'path' in slide.cta ? (
                  <a
                    {...linkProps(slide.cta.path!)}
                    className="inline-flex items-center gap-2 bg-white px-7 py-4 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-accent hover:text-white"
                  >
                    {slide.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <a
                    href={slide.cta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-white px-7 py-4 text-xs font-bold uppercase tracking-widest text-ink transition-colors hover:bg-ink hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {slide.cta.label}
                  </a>
                )}
                {index === 0 && (
                  <a
                    href={BUSINESS_INFO.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-white px-7 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-white hover:text-ink"
                  >
                    Konsultasi Gratis
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Kontrol slider */}
      <button
        onClick={() => go(-1)}
        aria-label="Slide sebelumnya"
        className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/15 backdrop-blur hover:bg-white hover:text-ink lg:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Slide berikutnya"
        className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/15 backdrop-blur hover:bg-white hover:text-ink lg:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setIndex(i)}
            aria-label={`Ke slide ${i + 1}`}
            className={`h-1 transition-all ${i === index ? 'w-10 bg-white' : 'w-5 bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Strip keunggulan ---------------- */

const USPS = [
  { icon: ShieldCheck, title: 'Produk Resmi', text: 'Terdaftar & bergaransi asli' },
  { icon: Truck, title: 'Kirim Nasional', text: 'Ke seluruh Indonesia' },
  { icon: MessageCircle, title: 'Konsultasi Gratis', text: 'Dibantu ahli via WhatsApp' },
  { icon: BadgePercent, title: 'Harga Grosir', text: 'Langsung dari distributor' },
];

function UspStrip() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {USPS.map(({ icon: Icon, title, text }, i) => (
          <div
            key={title}
            className={`flex items-center gap-3 px-4 py-5 sm:px-6 lg:justify-center ${
              i % 2 === 0 ? 'border-r border-line' : 'lg:border-r'
            } ${i < 2 ? 'border-b border-line lg:border-b-0' : ''} ${i === 3 ? 'lg:border-r-0' : ''}`}
          >
            <Icon className="h-7 w-7 shrink-0 text-brand" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider sm:text-sm">{title}</p>
              <p className="text-[11px] text-muted sm:text-xs">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Judul section ---------------- */

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
        <h2 className="font-heading text-2xl font-black uppercase tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

const ViewAll = ({ path, label = 'Lihat Semua' }: { path: string; label?: string }) => (
  <a
    {...linkProps(path)}
    className="group inline-flex shrink-0 items-center gap-1 border-b-2 border-ink pb-0.5 text-xs font-bold uppercase tracking-widest hover:border-brand hover:text-brand"
  >
    {label}
    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
  </a>
);

/* ---------------- Logo official store ---------------- */

function OfficialStoreStrip() {
  // Satu logo per marketplace (Shopee punya 2 toko, di beranda cukup tampil sekali)
  const stores = OFFICIAL_STORES.filter((s, i, all) => all.findIndex((o) => o.logo === s.logo) === i);

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-black tracking-tight sm:text-4xl">Tersedia di Marketplace</h2>
          <p className="mt-2 text-sm text-muted">Pilih Official Store kami di bawah ini</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {stores.map((store) =>
            store.url ? (
              <a
                key={store.logo}
                href={store.url}
                target="_blank"
                rel="noreferrer"
                aria-label={store.name}
                className="flex h-24 items-center justify-center transition-transform hover:-translate-y-1"
              >
                <span className="scale-[0.72] sm:scale-90 xl:scale-100">
                  <MarketplaceLogo logo={store.logo} />
                </span>
              </a>
            ) : (
              <div
                key={store.logo}
                title={`${store.name} segera hadir`}
                className="flex h-24 items-center justify-center opacity-40 grayscale"
              >
                <span className="scale-[0.72] sm:scale-90 xl:scale-100">
                  <MarketplaceLogo logo={store.logo} />
                </span>
              </div>
            )
          )}
        </div>
        <div className="mt-6 text-center">
          <a {...linkProps('/official-store')} className="group inline-flex items-center gap-1 border-b-2 border-ink pb-0.5 text-xs font-bold uppercase tracking-widest hover:border-brand hover:text-brand">
            Lihat Semua Official Store
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Kategori ---------------- */

function CategoryTiles({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading eyebrow="Belanja per kategori" title="Cari Sesuai Hama" action={<ViewAll path="/produk" />} />
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-5">
        {CATEGORIES.map((c) => {
          const img = firstImageOf(products, c.name);
          const count = products.filter((p) => p.category === c.name).length;
          return (
            <a
              key={c.name}
              {...linkProps(categoryPath(c.name))}
              className="group relative aspect-[3/4] w-[44%] shrink-0 snap-start overflow-hidden sm:w-auto"
              style={{ backgroundColor: c.color }}
            >
              {img && (
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="font-heading text-lg font-black uppercase leading-tight sm:text-xl">{c.label}</p>
                <p className="mt-1 flex items-center justify-between text-xs text-white/75">
                  {count > 0 ? `${count} produk` : c.desc}
                  <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Grid produk dengan tab ---------------- */

const TABS = ['Terbaru', 'Stok Ready', 'Harga Hemat'] as const;

function ProductTabs({ products, loading }: { products: Product[]; loading: boolean }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Terbaru');
  const newIds = useMemo(() => new Set(products.slice(0, 4).map((p) => p.id)), [products]);

  const list = useMemo(() => {
    if (tab === 'Stok Ready') return products.filter((p) => (p.stok ?? 0) > 10).slice(0, 8);
    if (tab === 'Harga Hemat') return [...products].filter((p) => (p.stok ?? 0) > 0).sort((a, b) => a.price - b.price).slice(0, 8);
    return products.slice(0, 8);
  }, [tab, products]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20">
      <SectionHeading eyebrow="Katalog" title="Produk Pilihan" action={<ViewAll path="/produk" />} />
      <div className="mb-8 flex gap-6 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 pb-3 text-xs font-bold uppercase tracking-widest transition-colors sm:text-sm ${
              tab === t ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : list.map((p) => <ProductCard key={p.id} product={p} isNew={newIds.has(p.id)} />)}
      </div>
      {!loading && list.length === 0 && (
        <p className="py-12 text-center text-sm text-muted">Belum ada produk untuk ditampilkan.</p>
      )}
      <div className="mt-12 flex justify-center">
        <a
          {...linkProps('/produk')}
          className="inline-flex items-center gap-2 border-2 border-ink px-10 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-ink hover:text-white"
        >
          Lihat Semua Produk
        </a>
      </div>
    </section>
  );
}

/* ---------------- Banner promo ---------------- */

function PromoBanners({ products }: { products: Product[] }) {
  const banners = [
    {
      eyebrow: 'Perlindungan bangunan',
      title: 'Anti Rayap Jangka Panjang',
      cta: 'Belanja Termitisida',
      path: categoryPath('PEMBASMI RAYAP'),
      bg: '#0f3d22',
      image: firstImageOf(products, 'PEMBASMI RAYAP'),
    },
    {
      eyebrow: 'Perlengkapan lapangan',
      title: 'Alat Fogging & Sprayer',
      cta: 'Lihat Peralatan',
      path: categoryPath('ALAT PEMBASMI HAMA'),
      bg: '#ea580c',
      image: firstImageOf(products, 'ALAT PEMBASMI HAMA'),
    },
  ];

  return (
    <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:pb-20">
      {banners.map((b) => (
        <a
          key={b.title}
          {...linkProps(b.path)}
          className="group relative flex min-h-[260px] overflow-hidden p-8 text-white sm:min-h-[320px] sm:p-10"
          style={{ backgroundColor: b.bg }}
        >
          {b.image && (
            <img
              src={b.image}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              className="absolute -bottom-4 -right-6 h-[85%] w-1/2 object-contain opacity-90 transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="relative flex max-w-[60%] flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">{b.eyebrow}</p>
              <h3 className="mt-2 font-heading text-3xl font-black uppercase leading-none sm:text-4xl">{b.title}</h3>
            </div>
            <span className="mt-6 inline-flex w-fit items-center gap-2 border-b-2 border-white pb-1 text-xs font-bold uppercase tracking-widest">
              {b.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </a>
      ))}
    </section>
  );
}

/* ---------------- Statistik ---------------- */

function StatsBand() {
  return (
    <section className="bg-brand text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-12 md:items-center lg:px-8">
        <div className="md:col-span-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/70">Tentang kami</p>
          <h2 className="mt-2 font-heading text-3xl font-black uppercase leading-tight sm:text-4xl">
            Sahabat petani & pelaku pest control
          </h2>
          <a {...linkProps('/keunggulan')} className="mt-5 inline-flex items-center gap-2 border-b-2 border-white pb-0.5 text-xs font-bold uppercase tracking-widest">
            Kenapa memilih kami <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="grid grid-cols-3 gap-4 md:col-span-7">
          {BUSINESS_INFO.stats.map((s) => (
            <div key={s.label} className="border-l border-white/30 pl-4">
              <p className="font-heading text-3xl font-black sm:text-5xl">{s.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-white/70 sm:text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Artikel ---------------- */

function LatestArticles() {
  const { articles, loading } = useArticles();
  if (!loading && articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading eyebrow="Edukasi" title="Tips & Artikel" action={<ViewAll path="/artikel" />} />
      <div className="grid gap-8 md:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse bg-soft" />)
          : articles.slice(0, 3).map((a) => (
              <a key={a.id} {...linkProps(`/artikel/${a.id}`)} className="group block">
                <div className="aspect-[4/3] overflow-hidden bg-soft">
                  <img src={a.image} alt={a.title} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-accent">{a.category}</p>
                <h3 className="mt-1 line-clamp-2 font-heading text-lg font-extrabold leading-snug group-hover:underline">{a.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{a.summary}</p>
              </a>
            ))}
      </div>
    </section>
  );
}

/* ---------------- CTA WhatsApp ---------------- */

function ConsultCta() {
  return (
    <section className="bg-soft">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <h2 className="font-heading text-2xl font-black uppercase sm:text-3xl">Bingung pilih produk yang tepat?</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Ceritakan jenis hama dan lokasinya. Tim kami bantu rekomendasikan produk dan dosis yang sesuai, gratis.
          </p>
        </div>
        <a
          href={BUSINESS_INFO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-2 bg-brand px-8 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand-dark"
        >
          <MessageCircle className="h-4 w-4" />
          Konsultasi via WhatsApp
        </a>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { products, loading } = useProducts();

  return (
    <>
      <HeroSlider products={products} />
      <UspStrip />
      <OfficialStoreStrip />
      <CategoryTiles products={products} />
      <ProductTabs products={products} loading={loading} />
      <PromoBanners products={products} />
      <StatsBand />
      <LatestArticles />
      <ConsultCta />
    </>
  );
}
