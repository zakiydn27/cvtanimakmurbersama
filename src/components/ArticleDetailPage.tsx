import React, { useEffect, useMemo } from 'react';
import { ChevronRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../data';
import { useArticles } from '../hooks/useArticles';
import { useProducts } from '../hooks/useProducts';
import { linkProps } from '../router';
import ProductCard from './ProductCard';

export default function ArticleDetailPage({ id }: { id: string }) {
  const { articles, loading } = useArticles();
  const { products } = useProducts();
  const article = useMemo(() => articles.find((a) => String(a.id) === id), [articles, id]);
  const others = articles.filter((a) => String(a.id) !== id).slice(0, 3);

  useEffect(() => {
    if (article) document.title = `${article.title} | Tani Makmur Bersama`;
    return () => {
      document.title = 'CV. Tani Makmur Bersama';
    };
  }, [article]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse space-y-4 px-4 py-16">
        <div className="h-10 w-3/4 bg-soft" />
        <div className="aspect-[16/9] bg-soft" />
        <div className="h-40 bg-soft" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-heading text-3xl font-black uppercase">Artikel tidak ditemukan</h1>
        <a {...linkProps('/artikel')} className="mt-6 inline-block bg-ink px-8 py-4 text-xs font-bold uppercase tracking-widest text-white">
          Lihat Semua Artikel
        </a>
      </div>
    );
  }

  const waUrl = `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(
    `Halo Tani Makmur Bersama, saya baru membaca artikel "${article.title}" dan ingin berkonsultasi.`
  )}`;

  return (
    <div>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <nav className="mb-6 flex items-center gap-1.5 overflow-hidden text-xs text-muted">
          <a {...linkProps('/')} className="shrink-0 hover:text-ink">Beranda</a>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <a {...linkProps('/artikel')} className="shrink-0 hover:text-ink">Artikel</a>
          <ChevronRight className="h-3 w-3 shrink-0" />
          <span className="truncate text-ink">{article.title}</span>
        </nav>

        <p className="text-[11px] font-bold uppercase tracking-widest text-accent">{article.category}</p>
        <h1 className="mt-2 font-heading text-3xl font-black leading-tight tracking-tight sm:text-5xl">{article.title}</h1>
        <p className="mt-4 text-sm text-muted">
          Oleh <span className="font-semibold text-ink">{article.author}</span> · {article.publishedAt}
        </p>

        <div className="mt-8 aspect-[16/9] overflow-hidden bg-soft">
          <img src={article.image} alt={article.title} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
        </div>

        {article.summary && <p className="mt-8 text-lg font-medium leading-relaxed">{article.summary}</p>}
        <div className="mt-6 whitespace-pre-line text-base leading-relaxed text-ink/80">{article.content}</div>

        <div className="mt-10 space-y-3 border-l-4 border-accent bg-soft p-5 text-sm">
          <p className="font-bold uppercase tracking-wider">Tips keamanan</p>
          <p className="text-ink/80">
            Ikuti petunjuk pada label kemasan. Gunakan masker, sarung tangan, dan pelindung mata saat aplikasi, terutama untuk fogging di dalam ruangan.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 border-y border-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 shrink-0 text-brand" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-bold">Masih ragu dengan penanganannya?</p>
              <p className="text-xs text-muted">Konsultasi gratis dengan tim kami.</p>
            </div>
          </div>
          <a href={waUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-brand px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-white">
            <MessageCircle className="h-4 w-4" /> Chat WhatsApp
          </a>
        </div>
      </article>

      {products.length > 0 && (
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-black uppercase sm:text-3xl">Produk Rekomendasi</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
              {products.filter((p) => (p.stok ?? 0) > 0).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="border-t border-line bg-soft">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-black uppercase sm:text-3xl">Artikel Lainnya</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {others.map((a) => (
                <a key={a.id} {...linkProps(`/artikel/${a.id}`)} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-white">
                    <img src={a.image} alt={a.title} loading="lazy" referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-4 line-clamp-2 font-heading text-lg font-extrabold leading-snug group-hover:underline">{a.title}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
