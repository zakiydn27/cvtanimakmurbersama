import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import { linkProps } from '../router';

export function PageBanner({ eyebrow, title, text, crumb }: { eyebrow: string; title: string; text?: string; crumb: string }) {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <nav className="mb-3 flex items-center gap-1.5 text-xs text-white/60">
          <a {...linkProps('/')} className="hover:text-white">Beranda</a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white">{crumb}</span>
        </nav>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
        <h1 className="mt-1 font-heading text-4xl font-black uppercase tracking-tight sm:text-5xl">{title}</h1>
        {text && <p className="mt-2 max-w-2xl text-sm text-white/70 sm:text-base">{text}</p>}
      </div>
    </section>
  );
}

export default function ArticlesSection() {
  const { articles, loading } = useArticles();
  const [featured, ...rest] = articles;

  return (
    <div>
      <PageBanner
        crumb="Artikel"
        eyebrow="Panduan & edukasi"
        title="Tips & Artikel"
        text="Wawasan seputar pencegahan rayap, fogging, hingga perilaku hama di rumah, gudang, dan lahan pertanian."
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {loading ? (
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse bg-soft" />)}
          </div>
        ) : articles.length === 0 ? (
          <p className="border border-dashed border-line py-20 text-center text-sm text-muted">Belum ada artikel.</p>
        ) : (
          <>
            {/* Artikel utama */}
            <a {...linkProps(`/artikel/${featured.id}`)} className="group mb-14 grid gap-6 md:grid-cols-2 md:items-center md:gap-10">
              <div className="aspect-[16/10] overflow-hidden bg-soft">
                <img src={featured.image} alt={featured.title} referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent">{featured.category}</p>
                <h2 className="mt-2 font-heading text-2xl font-black leading-tight group-hover:underline sm:text-4xl">{featured.title}</h2>
                <p className="mt-3 line-clamp-3 text-sm text-muted sm:text-base">{featured.summary}</p>
                <p className="mt-4 text-xs text-muted">{featured.author} · {featured.publishedAt}</p>
                <span className="mt-6 inline-block border-b-2 border-ink pb-0.5 text-xs font-bold uppercase tracking-widest">Baca Artikel</span>
              </div>
            </a>

            {rest.length > 0 && (
              <div className="grid gap-x-8 gap-y-12 border-t border-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => (
                  <a key={a.id} {...linkProps(`/artikel/${a.id}`)} className="group block">
                    <div className="aspect-[4/3] overflow-hidden bg-soft">
                      <img src={a.image} alt={a.title} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-accent">{a.category}</p>
                    <h3 className="mt-1 line-clamp-2 font-heading text-lg font-extrabold leading-snug group-hover:underline">{a.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{a.summary}</p>
                    <p className="mt-3 text-xs text-muted">{a.author} · {a.publishedAt}</p>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
