import React from 'react';
import { ArrowUpRight, ChevronRight, Music2, Phone, ShieldCheck } from 'lucide-react';
import { OFFICIAL_STORES, StoreLogo } from '../data';
import { linkProps } from '../router';

/* Logo marketplace dibuat ulang sederhana (ikon + nama) dengan warna khas masing-masing. */

function ShopeeBag() {
  return (
    <svg viewBox="0 0 40 44" className="h-11 w-10" aria-hidden>
      <path d="M13 12a7 7 0 0 1 14 0" fill="none" stroke="#EE4D2D" strokeWidth="3" />
      <path d="M4 12h32l-2.2 28a3 3 0 0 1-3 2.8H9.2a3 3 0 0 1-3-2.8z" fill="#EE4D2D" />
      <text x="20" y="35" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff" fontFamily="Inter, sans-serif">S</text>
    </svg>
  );
}

function LazadaHeart() {
  return (
    <svg viewBox="0 0 44 40" className="h-10 w-11" aria-hidden>
      <defs>
        <linearGradient id="lzd" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFB000" />
          <stop offset="0.5" stopColor="#F5501E" />
          <stop offset="1" stopColor="#E6127D" />
        </linearGradient>
      </defs>
      <path d="M22 38 3 24V8l9-6 10 6 10-6 9 6v16z" fill="url(#lzd)" />
    </svg>
  );
}

function BlibliBag() {
  return (
    <svg viewBox="0 0 36 42" className="h-11 w-9" aria-hidden>
      <circle cx="13" cy="6" r="3" fill="#F15A24" />
      <circle cx="19" cy="4" r="3" fill="#FBB03B" />
      <circle cx="24" cy="7" r="3" fill="#39B54A" />
      <path d="M3 12h30l-1.5 27a2.5 2.5 0 0 1-2.5 2.3H7a2.5 2.5 0 0 1-2.5-2.3z" fill="#0095DA" />
      <circle cx="13" cy="22" r="1.8" fill="#fff" />
      <circle cx="23" cy="22" r="1.8" fill="#fff" />
      <path d="M12 28q6 5 12 0" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function MarketplaceLogo({ logo }: { logo: StoreLogo }) {
  switch (logo) {
    case 'whatsapp':
      return (
        <span className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]">
            <Phone className="h-5 w-5 fill-white text-white" />
          </span>
          <span className="text-left font-heading text-lg font-extrabold italic leading-[1.05] text-[#111]">
            Pesan via
            <br />
            WhatsApp
          </span>
        </span>
      );
    case 'shopee':
      return (
        <span className="flex items-center gap-2">
          <ShopeeBag />
          <span className="text-3xl font-medium tracking-tight text-[#EE4D2D]">Shopee</span>
        </span>
      );
    case 'tiktok':
      return (
        <span className="flex flex-col items-center leading-none">
          <span className="flex items-center gap-1">
            <span className="relative h-8 w-8">
              <Music2 className="absolute -left-0.5 -top-0.5 h-8 w-8 text-[#25F4EE]" strokeWidth={3} />
              <Music2 className="absolute left-0.5 top-0.5 h-8 w-8 text-[#FE2C55]" strokeWidth={3} />
              <Music2 className="absolute inset-0 h-8 w-8 text-[#111]" strokeWidth={3} />
            </span>
            <span className="text-2xl font-black tracking-tight text-[#111]">
              TikTok <span className="font-medium">Shop</span>
            </span>
          </span>
          <span className="mt-1 text-xs font-medium text-[#333]">
            by <span className="font-bold">tokopedia</span>
          </span>
        </span>
      );
    case 'tokopedia':
      return <span className="text-3xl font-extrabold tracking-tight text-[#03AC0E]">tokopedia</span>;
    case 'lazada':
      return (
        <span className="flex items-center gap-2.5">
          <LazadaHeart />
          <span className="text-3xl font-semibold tracking-tight text-[#0F146D]">Lazada</span>
        </span>
      );
    case 'blibli':
      return (
        <span className="flex items-center gap-1.5">
          <BlibliBag />
          <span className="text-3xl font-extrabold tracking-tight text-[#0095DA]">blibli</span>
        </span>
      );
  }
}

export default function OfficialStorePage() {
  return (
    <div>
      <nav className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-4 text-xs text-muted sm:px-6 lg:px-8">
        <a {...linkProps('/')} className="hover:text-ink">Beranda</a>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">Official Store</span>
      </nav>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-black tracking-tight sm:text-5xl">Tersedia di Marketplace</h1>
          <p className="mt-3 text-sm text-muted sm:text-base">Pilih Official Store kami di bawah ini</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OFFICIAL_STORES.map((store, i) => {
            const active = Boolean(store.url);
            const content = (
              <>
                <div className="flex h-24 items-center justify-center">
                  <MarketplaceLogo logo={store.logo} />
                </div>
                <div className="flex items-center justify-between border-t border-line pt-4 text-xs">
                  <span className="font-semibold text-muted">{store.note ?? 'Official Store'}</span>
                  {active ? (
                    <span className="flex items-center gap-1 font-bold uppercase tracking-widest text-ink">
                      Kunjungi
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  ) : (
                    <span className="font-bold uppercase tracking-widest text-muted">Segera hadir</span>
                  )}
                </div>
              </>
            );

            return active ? (
              <a
                key={i}
                href={store.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${store.name}${store.note ? ` ${store.note}` : ''}`}
                className="group border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:border-ink hover:shadow-lg"
              >
                {content}
              </a>
            ) : (
              <div key={i} className="border border-dashed border-line bg-white p-6 opacity-60" aria-label={`${store.name} segera hadir`}>
                {content}
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-12 flex max-w-2xl items-start gap-3 bg-soft p-5 text-sm">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
          <p className="text-ink/80">
            Untuk jaminan keaslian produk, pastikan Anda membeli hanya melalui official store di atas atau langsung lewat website ini.
          </p>
        </div>
      </section>
    </div>
  );
}
