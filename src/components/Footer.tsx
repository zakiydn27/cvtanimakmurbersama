import React from 'react';
import { Instagram, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { BUSINESS_INFO, CATEGORIES } from '../data';
import { categoryPath, linkProps } from '../router';


export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="col-span-2 space-y-5 md:col-span-4">
          <a {...linkProps('/')} className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center bg-brand font-heading text-sm font-black">TM</span>
            <span className="flex flex-col leading-none">
              <span className="font-heading text-lg font-black uppercase">Tani Makmur</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">Bersama</span>
            </span>
          </a>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">{BUSINESS_INFO.headline}</p>
          <div className="flex gap-2">
            <a href={BUSINESS_INFO.whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center border border-white/20 hover:bg-white hover:text-ink">
              <MessageCircle className="h-4 w-4" />
            </a>
            <a href={BUSINESS_INFO.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center border border-white/20 hover:bg-white hover:text-ink">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={`mailto:${BUSINESS_INFO.email}`} aria-label="Email" className="flex h-10 w-10 items-center justify-center border border-white/20 hover:bg-white hover:text-ink">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="space-y-4 md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Belanja</h4>
          <ul className="space-y-2.5 text-sm">
            <li><a {...linkProps('/produk')} className="hover:text-accent">Semua Produk</a></li>
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <a {...linkProps(categoryPath(c.name))} className="text-white/80 hover:text-accent">{c.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Informasi</h4>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li><a {...linkProps('/keunggulan')} className="hover:text-accent">Tentang Kami</a></li>
            <li><a {...linkProps('/artikel')} className="hover:text-accent">Artikel & Tips</a></li>
            <li><a {...linkProps('/official-store')} className="hover:text-accent">Official Store</a></li>
            <li><a {...linkProps('/kontak')} className="hover:text-accent">Hubungi Kami</a></li>
            <li><a {...linkProps('/cart')} className="hover:text-accent">Keranjang</a></li>
          </ul>
        </div>

        <div className="col-span-2 space-y-4 md:col-span-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Hubungi Kami</h4>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="leading-relaxed">{BUSINESS_INFO.fullAddress}</span>
            </li>
            <li className="flex gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={BUSINESS_INFO.whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-accent">{BUSINESS_INFO.phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${BUSINESS_INFO.email}`} className="break-all hover:text-accent">{BUSINESS_INFO.email}</a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{BUSINESS_INFO.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <span>&copy; {year} CV. {BUSINESS_INFO.name}. Hak cipta dilindungi.</span>
          <span>Distributor resmi produk pengendali hama</span>
        </div>
      </div>
    </footer>
  );
}
