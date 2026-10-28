import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ChevronRight, 
  ShoppingBag, 
  ShoppingCart, 
  ExternalLink, 
  ShieldCheck, 
  Award, 
  Zap, 
  Truck, 
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { Product } from '../types';
import { BUSINESS_INFO } from '../data';
import { useCart } from '../components/CartContext';
import { supabase } from '@/lib/supabaseClient';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onNavigateToProduct: (product: Product) => void;
  onOrderProduct: (product: Product) => void;
}

// ==========================================
// KOMPONEN SECTION TITLE
// ==========================================
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-1 h-7 bg-[#ea580c] rounded-full flex-shrink-0" />
    <h3 className="text-base sm:text-lg font-heading font-extrabold text-[#1e5631] uppercase tracking-wide">
      {children}
    </h3>
  </div>
);

// ==========================================
// PARSER DESKRIPSI TERSTRUKTUR
// ==========================================
const renderStructuredDescription = (description: string) => {
  if (!description) return null;

  const sections = description.split(/\*\*(.*?)\*\*/g);
  const elements: React.JSX.Element[] = [];
  let i = 0;

  while (i < sections.length) {
    const text = sections[i].trim();
    
    if (text === '') {
      i++;
      continue;
    }

    if (i % 2 === 1 && text.length > 0) {
      const title = text;
      const content = sections[i + 1]?.trim() || '';
      
      elements.push(
        <div key={`section-${i}`} className="mb-8">
          <SectionTitle>{title}</SectionTitle>
          <div className="space-y-3">
            {content.split('\n').map((line, idx) => {
              const trimmedLine = line.trim();
              if (!trimmedLine) return null;
              
              if (trimmedLine.startsWith('✓') || trimmedLine.startsWith('•')) {
                return (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-[#ea580c]/30 transition-colors">
                    <div className="w-5 h-5 rounded-full bg-[#ea580c]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-[#ea580c] rounded-full" />
                    </div>
                    <span className="text-sm text-slate-700 leading-relaxed flex-grow">
                      {trimmedLine.replace(/^[✓•]\s*/, '')}
                    </span>
                  </div>
                );
              }
              
              if (/^\d+\.\s/.test(trimmedLine)) {
                const num = trimmedLine.match(/^(\d+)\./)?.[1];
                const textContent = trimmedLine.replace(/^\d+\.\s*/, '');
                return (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-[#ea580c]/30 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {num}
                    </div>
                    <span className="text-sm text-slate-700 leading-relaxed flex-grow pt-0.5">{textContent}</span>
                  </div>
                );
              }
              
              return (
                <p key={idx} className="text-sm text-slate-700 leading-relaxed py-2">
                  {trimmedLine}
                </p>
              );
            })}
          </div>
        </div>
      );
      i += 2;
    } else {
      if (text && i === 0) {
        elements.push(
          <div key={`intro-${i}`} className="mb-6">
            <p className="text-sm text-slate-700 leading-relaxed">{text}</p>
          </div>
        );
      }
      i++;
    }
  }

  return <div>{elements}</div>;
};

export default function ProductDetailPage({ product, onBack, onNavigateToProduct, onOrderProduct }: ProductDetailPageProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.stok === 0) {
      alert('Maaf, stok produk ini sedang habis.');
      return;
    }
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAddedToCart(false);
  }, [product]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(3);

      if (!error && data) {
        setRelatedProducts(data);
      }
    };

    fetchRelatedProducts();
  }, [product.category, product.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="pb-24 pt-28 bg-gradient-to-br from-slate-50 to-slate-100 relative min-h-screen text-slate-700 antialiased"
      id={`product-detail-page-${product.id}`}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(22,101,52,0.08),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[radial-gradient(circle_at_bottom_left,rgba(234,88,12,0.05),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation / Breadcrumb */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
            <button onClick={onBack} className="hover:text-brand-accent transition-colors">BERANDA</button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-brand-accent font-bold uppercase font-sans">KATALOG PRODUK</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-600 truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>
          
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-heading font-extrabold tracking-widest text-slate-600 hover:text-white bg-white hover:bg-slate-800 border border-slate-200 hover:border-slate-800 px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>KEMBALI KE BERANDA</span>
          </button>
        </div>

        {/* Core Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left panel: Product Image Gallery */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg p-6 flex items-center justify-center min-h-[320px] md:min-h-[420px]">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-[300px] md:max-h-[380px] w-auto object-contain filter brightness-95 transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#1e5631] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase shadow-lg">
                {product.category}
              </div>
            </div>

            {/* Badges USP info */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-center space-y-1">
                <Award className="w-5 h-5 text-brand-accent mx-auto" />
                <span className="block text-[9px] font-mono tracking-wider font-bold text-slate-800 uppercase">100% ASLI</span>
                <span className="block text-[8px] text-slate-500">Resmi Kementerian</span>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-center space-y-1">
                <Zap className="w-5 h-5 text-brand-accent mx-auto" />
                <span className="block text-[9px] font-mono tracking-wider font-bold text-slate-800 uppercase">REAKSI CEPAT</span>
                <span className="block text-[8px] text-slate-500">Hama Tuntas Instan</span>
              </div>
              <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-center space-y-1">
                <Truck className="w-5 h-5 text-brand-accent mx-auto" />
                <span className="block text-[9px] font-mono tracking-wider font-bold text-slate-800 uppercase">PENGIRIMAN</span>
                <span className="block text-[8px] text-slate-500">Nasional 34 Provinsi</span>
              </div>
            </div>
          </div>

          {/* Right panel: Informational Text details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.name}
              </h1>
              
              {/* Pricing section */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="bg-white border-2 border-slate-200 shadow-sm px-5 py-3 rounded-xl">
                  <span className="block text-[9px] font-mono text-slate-500 uppercase">Harga Khusus Distributor</span>
                  <span className="text-2xl font-heading font-black text-brand-accent">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Indikator Stok Dinamis */}
                {(product.stok ?? 0) > 10 ? (
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>STOK READY ({product.stok} pcs)</span>
                  </div>
                ) : (product.stok ?? 0) > 0 ? (
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>STOK TERBATAS ({product.stok} pcs)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200 shadow-sm">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>STOK HABIS</span>
                  </div>
                )}
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y-2 border-slate-200 py-4 font-mono text-xs bg-white rounded-xl p-4 shadow-sm">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">Kategori</span>
                <span className="text-slate-800 font-bold">{product.category}</span>
              </div>
              {product.pestTarget && (
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">Target Sasaran</span>
                  <span className="text-brand-accent font-bold truncate block" title={product.pestTarget}>{product.pestTarget}</span>
                </div>
              )}
              {product.formulation && (
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">Formulasi</span>
                  <span className="text-slate-800 font-bold truncate block">{product.formulation}</span>
                </div>
              )}
              {product.packaging && (
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">Kemasan</span>
                  <span className="text-slate-800 font-bold">{product.packaging}</span>
                </div>
              )}
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">Sertifikasi</span>
                <span className="text-emerald-700 font-bold">Terdaftar Resmi</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-1">Minimal Order</span>
                <span className="text-slate-800 font-semibold">1 Pcs</span>
              </div>
            </div>

            {/* ✅ Purchase CTA Channels - Tombol TAMBAH KE KERANJANG di sini */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-brand-accent block uppercase font-bold">
                  SALURAN PEMBELIAN RESMI
                </span>
                <p className="text-xs text-slate-600">
                  Tambahkan ke keranjang untuk checkout atau beli melalui marketplace resmi kami.
                </p>
              </div>

              {/* ✅ TOMBOL TAMBAH KE KERANJANG - Dipindahkan ke sini */}
              <button
                onClick={handleAddToCart}
                disabled={product.stok === 0}
                className={`inline-flex items-center justify-center font-heading font-black text-sm py-4 px-6 rounded-xl uppercase transition-all shadow-lg cursor-pointer w-full ${
                  product.stok === 0 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-[#1e5631] hover:bg-[#164226] text-white hover:shadow-xl'
                }`}
              >
                {addedToCart ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    <span>BERHASIL DITAMBAHKAN</span>
                  </>
                ) : product.stok === 0 ? (
                  <>
                    <XCircle className="w-5 h-5 mr-2" />
                    <span>STOK HABIS</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    <span>TAMBAH KE KERANJANG</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200">
                <a
                  href={BUSINESS_INFO.shopeeUrl1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-[#ee4d2d]/10 hover:bg-[#ee4d2d] text-[#ee4d2d] hover:text-white font-extrabold text-xs py-3 rounded-lg uppercase border border-[#ee4d2d]/20 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span>SHOPEE 1</span>
                </a>
                <a
                  href={BUSINESS_INFO.shopeeUrl2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-[#ee4d2d]/10 hover:bg-[#ee4d2d] text-[#ee4d2d] hover:text-white font-extrabold text-xs py-3 rounded-lg uppercase border border-[#ee4d2d]/20 transition-all shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                  <span>SHOPEE 2</span>
                </a>
                <a
                  href={BUSINESS_INFO.lazadaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-extrabold text-xs py-3 rounded-lg uppercase border border-blue-200 transition-all shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span>LAZADA</span>
                </a>
              </div>
            </div>

            {/* DESKRIPSI TERSTRUKTUR */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              {renderStructuredDescription(product.description)}
            </div>

            {/* Trust footer brand block */}
            <div className="flex items-center space-x-4 p-5 bg-white border-2 border-slate-200 shadow-sm rounded-xl">
              <div className="w-12 h-12 rounded-full bg-[#1e5631] flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h5 className="text-sm font-heading font-black text-slate-800">Jaminan Keaslian CV. Tani Makmur Bersama</h5>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">Garansi uang kembali 100% apabila produk terbukti tidak orisinal.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t-2 border-slate-200 space-y-8">
            <SectionTitle>
              PRODUK {product.category} SEJENIS
            </SectionTitle>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => onNavigateToProduct(prod)}
                  className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-brand-accent rounded-xl p-4 flex gap-4 items-center group transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-lg bg-slate-50 border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-grow min-w-0">
                    <span className="text-[9px] font-mono text-brand-accent uppercase block mb-0.5 font-bold">{prod.category}</span>
                    <h4 className="text-xs font-heading font-black text-slate-800 group-hover:text-brand-accent transition-colors truncate">
                      {prod.name}
                    </h4>
                    <p className="text-sm text-brand-accent font-bold mt-1">
                      Rp {prod.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-brand-accent group-hover:text-white transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}