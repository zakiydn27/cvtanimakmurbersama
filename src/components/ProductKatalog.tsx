import React, { useMemo, useState } from 'react';
import { ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '../data';
import { useProducts } from '../hooks/useProducts';
import { categoryPath, linkProps, navigate } from '../router';
import ProductCard, { ProductCardSkeleton } from './ProductCard';

interface ProductKatalogProps {
  category: string | null;
}

const SORTS = {
  terbaru: 'Terbaru',
  'harga-asc': 'Harga: Rendah ke Tinggi',
  'harga-desc': 'Harga: Tinggi ke Rendah',
  nama: 'Nama: A-Z',
} as const;
type SortKey = keyof typeof SORTS;

export default function ProductKatalog({ category }: ProductKatalogProps) {
  const { products, loading } = useProducts();
  const [sort, setSort] = useState<SortKey>('terbaru');
  const [query, setQuery] = useState('');
  const [readyOnly, setReadyOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const current = CATEGORIES.find((c) => c.name === category);
  const newIds = useMemo(() => new Set(products.slice(0, 4).map((p) => p.id)), [products]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (readyOnly && (p.stok ?? 0) <= 0) return false;
      if (q && ![p.name, p.pestTarget, p.description].some((f) => f?.toLowerCase().includes(q))) return false;
      return true;
    });
    if (sort === 'harga-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'harga-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'nama') result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'id'));
    return result;
  }, [products, category, query, sort, readyOnly]);

  const countFor = (name: string | null) =>
    name ? products.filter((p) => p.category === name).length : products.length;

  const CategoryList = (
    <ul className="space-y-1">
      {[null, ...CATEGORIES.map((c) => c.name)].map((name) => {
        const active = name === category;
        const label = name ? CATEGORIES.find((c) => c.name === name)!.label : 'Semua Produk';
        return (
          <li key={name ?? 'semua'}>
            <a
              {...linkProps(categoryPath(name), () => setFilterOpen(false))}
              className={`flex items-center justify-between py-2 text-sm transition-colors ${
                active ? 'font-bold text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              <span className="flex items-center gap-2">
                {active && <span className="h-1.5 w-1.5 bg-accent" />}
                {label}
              </span>
              <span className="text-xs text-muted">{loading ? '' : countFor(name)}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      {/* Banner judul halaman */}
      <section className="text-white" style={{ backgroundColor: current?.color ?? '#111111' }}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-white/70">
            <a {...linkProps('/')} className="hover:text-white">Beranda</a>
            <ChevronRight className="h-3 w-3" />
            <a {...linkProps('/produk')} className="hover:text-white">Produk</a>
            {current && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-white">{current.label}</span>
              </>
            )}
          </nav>
          <h1 className="font-heading text-4xl font-black uppercase tracking-tight sm:text-5xl">
            {current ? current.label : 'Semua Produk'}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-base">
            {current
              ? `${current.desc}. Produk resmi dan terdaftar dari distributor.`
              : 'Pestisida, insektisida, rodentisida, termitisida dan peralatan pengendali hama resmi.'}
          </p>
        </div>
      </section>

      {/* Chip kategori untuk HP */}
      <div className="sticky top-[98px] z-30 border-b border-line bg-white lg:hidden">
        <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
          {[null, ...CATEGORIES.map((c) => c.name)].map((name) => (
            <button
              key={name ?? 'semua'}
              onClick={() => navigate(categoryPath(name))}
              className={`shrink-0 border px-3.5 py-1.5 text-xs font-semibold ${
                name === category ? 'border-ink bg-ink text-white' : 'border-line text-ink'
              }`}
            >
              {name ? CATEGORIES.find((c) => c.name === name)!.label : 'Semua'}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8 lg:py-12">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 space-y-8">
            <div>
              <h3 className="mb-3 border-b border-line pb-3 text-xs font-bold uppercase tracking-widest">Kategori</h3>
              {CategoryList}
            </div>
            <div>
              <h3 className="mb-3 border-b border-line pb-3 text-xs font-bold uppercase tracking-widest">Ketersediaan</h3>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={readyOnly} onChange={(e) => setReadyOnly(e.target.checked)} className="h-4 w-4 accent-[#166534]" />
                Hanya stok tersedia
              </label>
            </div>
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari di katalog…"
                className="w-full border border-line py-2.5 pl-9 pr-9 text-sm outline-none focus:border-ink"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1" aria-label="Hapus pencarian">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted">{loading ? 'Memuat…' : `${list.length} produk`}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterOpen(true)}
                  className="flex items-center gap-1.5 border border-line px-3 py-2.5 text-xs font-semibold lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filter
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="cursor-pointer border border-line bg-white px-3 py-2.5 text-xs font-semibold outline-none focus:border-ink"
                  aria-label="Urutkan"
                >
                  {Object.entries(SORTS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : list.map((p) => <ProductCard key={p.id} product={p} isNew={newIds.has(p.id)} />)}
          </div>

          {!loading && list.length === 0 && (
            <div className="border border-dashed border-line py-20 text-center">
              <p className="font-heading text-lg font-bold uppercase">Produk tidak ditemukan</p>
              <p className="mt-1 text-sm text-muted">Coba kata kunci lain atau lihat kategori lainnya.</p>
              <a {...linkProps('/produk', () => setQuery(''))} className="mt-5 inline-block bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">
                Lihat Semua Produk
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Panel filter untuk HP */}
      {filterOpen && (
        <div className="fixed inset-0 z-[70] bg-black/40 lg:hidden" onClick={() => setFilterOpen(false)}>
          <div className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-heading text-base font-black uppercase">Filter</span>
              <button onClick={() => setFilterOpen(false)} aria-label="Tutup filter"><X className="h-5 w-5" /></button>
            </div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest">Kategori</h3>
            {CategoryList}
            <label className="mt-5 flex items-center gap-2 border-t border-line pt-5 text-sm">
              <input type="checkbox" checked={readyOnly} onChange={(e) => setReadyOnly(e.target.checked)} className="h-4 w-4 accent-[#166534]" />
              Hanya stok tersedia
            </label>
            <button onClick={() => setFilterOpen(false)} className="mt-6 w-full bg-ink py-3.5 text-xs font-bold uppercase tracking-widest text-white">
              Tampilkan {list.length} produk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
