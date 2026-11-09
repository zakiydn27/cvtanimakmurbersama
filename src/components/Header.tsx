import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, X, Search, ShoppingBag, ChevronDown, ChevronRight, MessageCircle } from 'lucide-react';
import { ANNOUNCEMENTS, BUSINESS_INFO, CATEGORIES, formatRupiah } from '../data';
import { useCart } from './CartContext';
import { useProducts } from '../hooks/useProducts';
import { Route, categoryPath, linkProps, navigate } from '../router';

interface HeaderProps {
  route: Route;
}

const NAV = [
  { label: 'Beranda', path: '/', match: ['home'] },
  { label: 'Belanja', path: '/produk', match: ['produk', 'detail'], mega: true },
  { label: 'Keunggulan', path: '/keunggulan', match: ['keunggulan'] },
  { label: 'Artikel', path: '/artikel', match: ['artikel', 'artikel-detail'] },
  { label: 'Official Store', path: '/official-store', match: ['official-store'] },
  { label: 'Kontak', path: '/kontak', match: ['kontak'] },
];

function AnnouncementBar() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];
  return (
    <div className="overflow-hidden bg-brand-dark text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap py-2">
        {items.map((text, i) => (
          <span key={i} className="mx-8 text-[11px] font-semibold uppercase tracking-[0.2em]">
            {text}
            <span className="ml-16 text-accent">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const { products } = useProducts();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) =>
        [p.name, p.category, p.pestTarget, p.description].some((f) => f?.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query, products]);

  return (
    <div className="fixed inset-0 z-[60] bg-black/40" onClick={onClose}>
      <div className="bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto max-w-3xl px-4 py-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (results[0]) {
                onClose();
                navigate(`/produk/${results[0].id}`);
              }
            }}
            className="flex items-center gap-3 border-b-2 border-ink pb-3"
          >
            <Search className="h-5 w-5 shrink-0 text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk, mis. racun tikus, rayap, fogging…"
              className="w-full bg-transparent text-base outline-none placeholder:text-muted"
            />
            <button type="button" onClick={onClose} aria-label="Tutup pencarian" className="p-1">
              <X className="h-5 w-5" />
            </button>
          </form>

          {query.trim() && (
            <div className="max-h-[60vh] overflow-y-auto py-3">
              {results.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">Produk "{query}" tidak ditemukan.</p>
              ) : (
                results.map((p) => (
                  <a
                    key={p.id}
                    {...linkProps(`/produk/${p.id}`, onClose)}
                    className="flex items-center gap-4 px-1 py-3 hover:bg-soft"
                  >
                    <img src={p.image} alt="" referrerPolicy="no-referrer" className="h-14 w-14 shrink-0 bg-soft object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted">{p.category}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold">{formatRupiah(p.price)}</span>
                  </a>
                ))
              )}
            </div>
          )}

          {!query.trim() && (
            <div className="flex flex-wrap gap-2 pt-4">
              <span className="w-full text-[11px] font-bold uppercase tracking-widest text-muted">Kategori populer</span>
              {CATEGORIES.map((c) => (
                <a
                  key={c.name}
                  {...linkProps(categoryPath(c.name), onClose)}
                  className="border border-line px-3 py-1.5 text-xs font-medium hover:border-ink"
                >
                  {c.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Header({ route }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  // Tutup semua menu setiap pindah halaman
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [route]);

  return (
    <>
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <header className={`border-b border-line bg-white transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
            {/* Kiri: tombol menu (HP) + logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileOpen(true)}
                className="-ml-2 p-2 lg:hidden"
                aria-label="Buka menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <a {...linkProps('/')} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center bg-brand font-heading text-sm font-black text-white">
                  TM
                </span>
                <span className="hidden flex-col whitespace-nowrap leading-none sm:flex">
                  <span className="font-heading text-base font-black uppercase tracking-tight">Tani Makmur</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">Bersama</span>
                </span>
              </a>
            </div>

            {/* Tengah: menu desktop */}
            <nav className="hidden h-full items-stretch lg:flex">
              {NAV.map((item) => {
                const active = item.match.includes(route.name);
                return (
                  <div
                    key={item.path}
                    className="relative flex items-stretch"
                    onMouseEnter={() => item.mega && setMegaOpen(true)}
                    onMouseLeave={() => item.mega && setMegaOpen(false)}
                  >
                    <a
                      {...linkProps(item.path)}
                      className={`flex items-center gap-1 whitespace-nowrap px-2.5 text-[13px] font-bold uppercase tracking-wider xl:px-4 transition-colors hover:text-brand ${
                        active ? 'text-brand' : 'text-ink'
                      }`}
                    >
                      {item.label}
                      {item.mega && <ChevronDown className="h-3.5 w-3.5" />}
                    </a>
                    {active && <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-brand xl:left-4 xl:right-4" />}
                  </div>
                );
              })}
            </nav>

            {/* Kanan: ikon */}
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="p-2 hover:text-brand" aria-label="Cari produk">
                <Search className="h-5 w-5" />
              </button>
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden p-2 hover:text-brand sm:block"
                aria-label="Chat WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a {...linkProps('/cart')} className="relative p-2 hover:text-brand" aria-label="Keranjang">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </a>
            </div>
          </div>

          {/* Mega menu kategori */}
          <div
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
            className={`absolute inset-x-0 hidden border-b border-line bg-white shadow-lg transition-all duration-200 lg:block ${
              megaOpen ? 'visible opacity-100' : 'invisible opacity-0'
            }`}
          >
            <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">
              <div className="col-span-3 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Belanja</p>
                <a {...linkProps('/produk')} className="block font-heading text-2xl font-black uppercase leading-tight hover:text-brand">
                  Semua Produk
                </a>
                <p className="text-sm text-muted">Pestisida, insektisida, rodentisida & alat pengendali hama resmi.</p>
              </div>
              <div className="col-span-9 grid grid-cols-5 gap-4">
                {CATEGORIES.map((c) => (
                  <a
                    key={c.name}
                    {...linkProps(categoryPath(c.name))}
                    className="group flex flex-col justify-between p-4 text-white transition-transform hover:-translate-y-0.5"
                    style={{ backgroundColor: c.color, minHeight: 120 }}
                  >
                    <span className="font-heading text-base font-extrabold uppercase leading-tight">{c.label}</span>
                    <span className="flex items-center justify-between text-xs text-white/80">
                      {c.desc}
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Menu samping untuk HP */}
      <div
        className={`fixed inset-0 z-[70] bg-black/40 transition-opacity lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-[80] flex w-[85%] max-w-sm flex-col bg-white transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <span className="font-heading text-base font-black uppercase">Menu</span>
          <button onClick={() => setMobileOpen(false)} className="p-2" aria-label="Tutup menu">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {NAV.map((item) => (
            <a
              key={item.path}
              {...linkProps(item.path)}
              className={`flex items-center justify-between border-b border-line px-5 py-4 text-sm font-bold uppercase tracking-wider ${
                item.match.includes(route.name) ? 'text-brand' : ''
              }`}
            >
              {item.label}
              <ChevronRight className="h-4 w-4 text-muted" />
            </a>
          ))}
          <p className="px-5 pb-2 pt-6 text-[11px] font-bold uppercase tracking-widest text-muted">Kategori</p>
          {CATEGORIES.map((c) => (
            <a key={c.name} {...linkProps(categoryPath(c.name))} className="flex items-center gap-3 px-5 py-3 text-sm">
              <span className="h-2.5 w-2.5" style={{ backgroundColor: c.color }} />
              {c.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          <a
            href={BUSINESS_INFO.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 bg-brand py-3.5 text-xs font-bold uppercase tracking-widest text-white"
          >
            <MessageCircle className="h-4 w-4" />
            Konsultasi via WhatsApp
          </a>
        </div>
      </aside>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
