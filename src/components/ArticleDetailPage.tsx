import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, Clock, CheckCircle2, ChevronRight, MessageCircle, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Article, Product } from '../types';
import { BUSINESS_INFO } from '../data';

interface ArticleDetailPageProps {
  article: Article;
  onBack: () => void;
  onNavigateToArticle: (article: Article) => void;
}

export default function ArticleDetailPage({ article, onBack, onNavigateToArticle }: ArticleDetailPageProps) {
  // ✅ STATE BARU: Data dari API
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Auto scroll to top on mount / article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article]);

  // ✅ EFEK BARU: Fetch semua data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles
        const articlesRes = await fetch('/api/articles');
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          setAllArticles(articlesData);
        }

        // Fetch products
        const productsRes = await fetch('/api/products');
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setAllProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // ✅ UBAH: Gunakan state 'allArticles' bukan 'ARTICLES' statis
  const otherArticles = allArticles.filter((art) => art.id !== article.id);

  // ✅ UBAH: Gunakan state 'allProducts' bukan 'PRODUCTS' statis
  const getSuggestedProducts = (): Product[] => {
    if (article.id === 'tips-3') {
      // Rat control article -> recommend rodenticides and traps
      return allProducts.filter(p => p.category === 'PEMBASMI HAMA GUDANG' || p.category === 'ALAT PEMBASMI HAMA');
    } else if (article.id === 'tips-1') {
      // Termite/Rayap article -> recommend Termitisida/Pestisida
      return allProducts.filter(p => p.category === 'PEMBASMI HAMA GUDANG');
    }
    // Default recommendations
    return allProducts.slice(0, 2);
  };

  const suggestedProducts = getSuggestedProducts();

  // Dynamic WhatsApp prefilled text helper
  const getWhatsAppLink = () => {
    const message = `Halo Tani Makmur Bersama, saya baru saja membaca artikel "${article.title}" dan ingin berkonsultasi mengenai solusi pengendalian hama terbaik.`;
    return `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="pb-24 pt-28 bg-brand-dark relative min-h-screen text-slate-700 antialiased"
      id="article-detail-page-container"
    >
      {/* Background Ambience Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(22,101,52,0.02),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[radial-gradient(circle_at_bottom_left,rgba(22,101,52,0.01),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumbs & Navigation Back Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
            <button onClick={onBack} className="hover:text-brand-accent transition-colors">BERANDA</button>
            <ChevronRight className="w-3.5 h-3.5 text-brand-secondary/30" />
            <span className="text-brand-accent font-bold uppercase font-sans">PANDUAN & EDUKASI</span>
            <ChevronRight className="w-3.5 h-3.5 text-brand-secondary/30" />
            <span className="text-slate-600 truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
          </div>
          
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-heading font-extrabold tracking-widest text-brand-secondary hover:text-white bg-brand-primary hover:bg-brand-secondary border border-brand-secondary/15 px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md group"
            id="btn-back-to-home"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>KEMBALI KE BERANDA</span>
          </button>
        </div>

        {/* Editorial Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Main Editorial Content (8 cols) */}
          <article className="lg:col-span-8 space-y-8" id="article-main-body">
            
            {/* Header Block */}
            <div className="space-y-4">
              <span className="inline-block bg-brand-accent text-white font-mono font-bold text-[10px] tracking-wider px-2.5 py-1 rounded uppercase">
                {article.category}
              </span>
              <h1 className="text-2xl sm:text-3.5xl lg:text-4.5xl font-heading font-extrabold text-slate-900 tracking-tight leading-snug" id="article-detail-title">
                {article.title}
              </h1>

              {/* Meta information row */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-2 text-xs text-slate-500 border-b border-brand-secondary/10 pb-4 font-mono">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-brand-accent" />
                  <span>Penulis: <strong className="text-slate-700">{article.author}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-brand-accent" />
                  <span>Rilis: <span className="text-slate-700">{article.publishedAt}</span></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-brand-accent" />
                  <span>Waktu Baca: <span className="text-slate-700">~ 4 mnt</span></span>
                </div>
              </div>
            </div>

            {/* Featured Hero Banner Image with subtle caption */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-brand-secondary/10 shadow-md h-64 sm:h-96 md:h-[420px] transition-all duration-500" id="article-featured-image-box">
              <img
                src={article.image}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-95"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex items-end">
                <span className="text-slate-200 text-xs font-mono italic">Foto dokumentasi pengujian lapangan & aplikator Tani Makmur Bersama</span>
              </div>
            </div>

            {/* Actual Article Body Text - Split by paragraph for readability */}
            <div className="prose max-w-none text-slate-600 leading-relaxed space-y-6 text-sm sm:text-base font-sans antialiased" id="article-body-content">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-slate-600">
                  {paragraph}
                </p>
              ))}

              {/* Extended informational filler to make the article informative, highly structural, and aesthetic */}
              <h3 className="text-lg sm:text-xl font-heading font-black text-slate-900 pt-4 tracking-wide border-l-4 border-brand-accent pl-3">
                Langkah-Langkah Implementasi Pengendalian Terstruktur
              </h3>
              <p className="text-slate-600">
                Langkah operasional yang tepat sangat menentukan tingkat kegagalan atau keberhasilan aplikasi formulat pengendali hama. Di bawah ini adalah ringkasan praktik terbaik yang direkomendasikan secara kolektif oleh tim kami:
              </p>
              <ul className="space-y-3 pl-4">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                  <span><strong className="text-slate-800">Identifikasi Lokasi Tepat:</strong> Pemetaan sarang rayap bawah tanah atau celah persembunyian tikus got di sekitar hunian diletakkan paling prioritas sebelum penyemprotan.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                  <span><strong className="text-slate-800">Konsistensi Takaran Obat:</strong> Pastikan pelarutan mengikuti rasio yang direkomendasikan pada label kemasan produk kita demi menghindari kekebalan mutasi biologis pada generasi berikutnya.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                  <span><strong className="text-slate-800">Alat Perlindungan Diri (APD):</strong> Selalu fungsikan masker pernapasan, sarung tangan karet tebal, serta penutup mata komersial saat aplikasi kabut thermal fogging.</span>
                </li>
              </ul>

              {/* Warnings and official guidelines callout banner */}
              <div className="p-5 sm:p-6 bg-amber-50 hover:bg-amber-100/50 border border-amber-200 rounded-xl space-y-3 transition-colors duration-300 mt-8">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h4 className="text-xs sm:text-sm font-mono font-bold tracking-wider text-amber-700 uppercase">
                    Peringatan Keamanan & Penggunaan
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  Semua zat aktif pestisida, herbisida, dan rodentisida memiliki konsentrasi tinggi. Penyalangan bahan kimia ini di luar panduan produsen resmi dapat mengakibatkan dampak negatif pada ekosistem air tawar ataupun hewan peliharaan sekitar. Tani Makmur Bersama berkomitmen menyediakan jalur konsultasi aktif guna memandu Anda demi mencegah penyalahgunaan.
                </p>
              </div>
            </div>

            {/* Author Footer/Sign-off Block */}
            <div className="flex items-center space-x-4 p-6 bg-brand-primary border border-brand-secondary/10 rounded-xl mt-12 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center border border-brand-accent/20">
                <ShieldCheck className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <h5 className="text-sm font-heading font-black text-slate-800">Ditulis Oleh Tim Agronomis & Formulator</h5>
                <p className="text-xs text-slate-600">CV. Tani Makmur Bersama - Bersertifikat nasional, berkomitmen penuh bagi kelestarian produk agrikultur Indonesia.</p>
              </div>
            </div>

          </article>

          {/* RIGHT COLUMN: Interactive Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-8" id="article-sidebar">
            
            {/* 1. Agricultural Pest Expert WhatsApp Consultation Callout */}
            <div className="p-6 bg-brand-primary border border-brand-secondary/15 hover:border-brand-accent rounded-2xl shadow-sm transition-all duration-300 space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-mono font-bold tracking-wider text-brand-accent uppercase">
                  <span>KONSULTASI GRATIS YA</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  ● AKTIF ONLINE
                </span>
              </div>
              
              <h4 className="text-slate-800 font-heading font-black text-base leading-snug">
                Bingung Masalah Hama? Tanya Agronomis Kami
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed font-sans">
                Kirim pesan WhatsApp sekarang juga untuk berdiskusi langsung mengenai dosis, pemilihan racun, atau cara pengaplikasian yang paling hemat.
              </p>
              
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-heading font-black tracking-widest rounded-xl transition-all duration-300 shadow-sm group"
              >
                <MessageCircle className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
                <span>HUBUNGI VIA WHATSAPP</span>
              </a>
            </div>

            {/* 2. Suggested Products linked to our selection */}
            {suggestedProducts.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold tracking-widest text-[#ea580c] uppercase border-b border-brand-secondary/10 pb-2 font-sans">
                  PRODUK YANG DIREKOMENDASIKAN
                </h4>
                <div className="space-y-4">
                  {suggestedProducts.map((prod) => (
                    <div 
                      key={prod.id}
                      className="p-4 bg-white hover:bg-brand-primary border border-brand-secondary/10 rounded-xl flex space-x-3 items-center group transition-colors duration-300 shadow-sm"
                    >
                      <img 
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-lg bg-slate-100 shrink-0 border border-brand-secondary/5"
                      />
                      <div className="flex-grow min-w-0">
                        <span className="text-[9px] font-mono text-brand-accent uppercase block font-semibold">{prod.category}</span>
                        <h5 className="text-xs font-heading font-bold text-slate-800 truncate max-w-[180px] group-hover:text-brand-accent transition-colors">
                          {prod.name}
                        </h5>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(prod.price)}
                        </p>
                      </div>
                      
                      {prod.whatsappUrl && (
                        <a 
                          href={prod.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-brand-primary text-brand-secondary hover:bg-brand-accent hover:text-white transition-all duration-300 shrink-0 border border-brand-secondary/10"
                          title="Tanya Detail Produk"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Other Articles readers */}
            {otherArticles.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold tracking-widest text-[#ea580c] uppercase border-b border-brand-secondary/10 pb-2 justify-start font-sans">
                  ARTIKEL LAINNYA
                </h4>
                <div className="space-y-3">
                  {otherArticles.map((art) => (
                    <button
                      key={art.id}
                      onClick={() => onNavigateToArticle(art)}
                      className="w-full text-left p-4 bg-white hover:bg-brand-primary border border-brand-secondary/10 rounded-xl transition-all duration-300 block space-y-2 group shadow-sm"
                    >
                      <span className="text-[10px] font-mono text-slate-500 block">{art.publishedAt}</span>
                      <h5 className="text-xs font-heading font-black text-slate-800 group-hover:text-brand-accent transition-colors leading-snug line-clamp-2">
                        {art.title}
                      </h5>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </aside>

        </div>

      </div>
    </motion.div>
  );
}