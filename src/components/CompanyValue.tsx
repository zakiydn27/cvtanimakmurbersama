import React from 'react';
import { ShieldCheck, Sparkles, TrendingDown, ShoppingBag, Truck, MessageCircle, BadgePercent, Award } from 'lucide-react';
import { ADVANTAGES, BUSINESS_INFO } from '../data';
import { linkProps } from '../router';
import { PageBanner } from './ArticlesSection';

const ICONS: Record<string, React.ElementType> = { ShieldCheck, Sparkles, TrendingDown, ShoppingBag };

const REASONS = [
  { icon: Award, title: 'Produk 100% Asli', text: 'Semua produk resmi dan terdaftar. Garansi uang kembali bila terbukti tidak orisinal.' },
  { icon: BadgePercent, title: 'Harga Tangan Pertama', text: 'Jalur distributor langsung, harga bersaing untuk eceran maupun grosir.' },
  { icon: Truck, title: 'Pengiriman Nasional', text: 'Ekspedisi darat, laut, dan udara ke seluruh Indonesia, skala kecil hingga tonase besar.' },
  { icon: MessageCircle, title: 'Konsultasi Gratis', text: 'Tim kami bantu memilih produk & dosis yang tepat untuk jenis hama Anda.' },
];

export function AdvantagesSection() {
  return (
    <div>
      <PageBanner
        crumb="Keunggulan"
        eyebrow="Mengapa memilih kami"
        title="Keunggulan Tani Makmur"
        text="Setiap lahan, gudang, dan bangunan punya tantangan hama yang berbeda. Mutu produk terdaftar dan jalur grosir langsung adalah dasar kepercayaan pelanggan kami."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white p-8">
              <Icon className="h-9 w-9 text-brand" strokeWidth={1.5} />
              <h3 className="mt-5 font-heading text-lg font-black uppercase">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 px-4 py-14 sm:px-6 lg:px-8">
          {BUSINESS_INFO.stats.map((s) => (
            <div key={s.label} className="border-l border-white/30 pl-4">
              <p className="font-heading text-3xl font-black sm:text-5xl">{s.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-white/70 sm:text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">Lini produk</p>
        <h2 className="mt-1 font-heading text-2xl font-black uppercase sm:text-4xl">Yang kami sediakan</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADVANTAGES.map((adv) => {
            const Icon = ICONS[adv.iconName] ?? ShieldCheck;
            return (
              <div key={adv.id} className="border border-line p-6 transition-colors hover:border-ink">
                <Icon className="h-7 w-7 text-accent" strokeWidth={1.5} />
                <h3 className="mt-4 font-heading text-base font-black uppercase">{adv.title}</h3>
                <p className="mt-1 text-sm text-muted">{adv.description}</p>
              </div>
            );
          })}
        </div>
        <a {...linkProps('/produk')} className="mt-10 inline-block bg-ink px-10 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand">
          Lihat Katalog Produk
        </a>
      </section>
    </div>
  );
}

export default AdvantagesSection;
