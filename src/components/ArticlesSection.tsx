import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, User, Calendar, ArrowRight, X, Clock } from 'lucide-react';
import { Article } from '../types';

interface ArticlesSectionProps {
  onArticleClick?: (article: Article) => void;
}

export default function ArticlesSection({ onArticleClick }: ArticlesSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  // ✅ STATE BARU: Data artikel dari API
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  // ✅ EFEK BARU: Fetch data artikel dari API backend
  useEffect(() => {
    fetch('/api/articles')
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat artikel');
        return res.json();
      })
      .then((data: Article[]) => {
        setArticles(data);
        setLoadingArticles(false);
      })
      .catch(err => {
        console.error('Error loading articles:', err);
        setLoadingArticles(false);
      });
  }, []);

  // ✅ Loading state saat fetch data
  if (loadingArticles) {
    return (
      <section id="artikel" className="py-24 bg-brand-dark border-t border-brand-secondary/10 relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-brand-accent text-lg">Memuat artikel...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="artikel" className="py-24 bg-brand-dark border-t border-brand-secondary/10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(22,101,52,0.02),transparent_40%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-accent uppercase block" id="articles-label">
            PANDUAN & EDUKASI PERTANIAN
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight" id="articles-title">
            Tips Penggunaan Produk yang Efektif
          </h2>
          <p className="text-slate-600 font-sans text-sm sm:text-base leading-relaxed">
            Ikuti wawasan terbaru dari formulator kami seputar pencegahan rayap pra-kontruksi, mist-fogging, hingga perilaku hama pengganggu di pemukiman.
          </p>
        </div>

        {/* ✅ Tampilkan pesan jika tidak ada artikel */}
        {articles.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-brand-secondary/30 rounded-xl">
            <p className="text-gray-400 text-lg">Belum ada artikel yang tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="articles-grid">
            {/* ✅ UBAH: Gunakan state 'articles' bukan 'ARTICLES' statis */}
            {articles.map((article, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                key={article.id}
                className="group flex flex-col bg-white border border-brand-secondary/10 hover:border-brand-accent rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                id={`article-card-${article.id}`}
              >
                {/* Image Area */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={article.image}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute bottom-3 left-3 bg-brand-accent text-white font-mono font-bold text-[9px] tracking-wider px-2 py-0.5 rounded-sm uppercase">
                    {article.category}
                  </div>
                </div>

                {/* Text Meta Info */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-mono">
                      <span className="flex items-center space-x-1">
                        <User className="w-3 h-3 text-brand-accent" />
                        <span>{article.author}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-brand-accent" />
                        <span>{article.publishedAt}</span>
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-slate-800 group-hover:text-brand-accent transition-colors text-base line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-secondary/10 flex justify-start">
                    <button
                      onClick={() => {
                        if (onArticleClick) {
                          onArticleClick(article);
                        } else {
                          setSelectedArticle(article);
                        }
                      }}
                      className="inline-flex items-center space-x-2 text-xs font-heading font-bold text-brand-accent hover:text-brand-secondary transition-colors group/btn"
                      id={`btn-read-article-${article.id}`}
                    >
                      <span>BACA UTUH</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal Overlay to read full guide */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              id="article-detail-modal"
              onClick={() => setSelectedArticle(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-brand-dark border border-brand-secondary/40 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Close button */}
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 z-10 text-gray-400 hover:text-brand-accent p-2 rounded bg-brand-primary/20 border border-brand-secondary/35 focus:outline-none"
                  id="btn-close-article"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="overflow-y-auto flex-grow">
                  {/* Hero Header image */}
                  <div className="relative h-60 w-full bg-brand-primary/10">
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-75"
                    />
                    <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded text-[10px] font-heading font-extrabold tracking-widest uppercase">
                      {selectedArticle.category}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Authors meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 border-b border-brand-secondary/20 pb-4">
                      <div className="flex items-center space-x-1.5">
                        <User className="w-4 h-4 text-brand-accent" />
                        <span>Penulis: {selectedArticle.author}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-4 h-4 text-brand-accent" />
                        <span>Rilis: {selectedArticle.publishedAt}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-4 h-4 text-brand-accent" />
                        <span>Estimasi: 4 Menit baca</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-white tracking-wide leading-snug">
                        {selectedArticle.title}
                      </h3>
                      <p className="text-sm text-gray-300 font-sans leading-relaxed text-slate-300 antialiased whitespace-pre-line">
                        {selectedArticle.content}
                      </p>
                      
                      <div className="p-4 bg-brand-primary/15 border border-brand-secondary/25 rounded-lg space-y-2 mt-6">
                        <h4 className="text-xs font-mono font-bold tracking-wider text-brand-accent uppercase">
                          💡 REKOMENDASI TERAPIS:
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-sans">
                          Aplikasi obat harus mengikuti petunjuk kemasan resmi. Kenakan respirator saringan ganda dan kacamata chemical safety saat aktivitas thermal fogging dalam ruangan resort atau villa.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Modal Action */}
                <div className="bg-brand-primary/10 border-t border-brand-secondary/20 p-4 shrink-0 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono tracking-widest">TANI MAKMUR BERSAMA</span>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="bg-brand-secondary hover:bg-brand-secondary/80 text-white px-4 py-2 rounded text-xs font-bold font-heading tracking-widest uppercase transition-colors"
                  >
                    Selesai Membaca
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}