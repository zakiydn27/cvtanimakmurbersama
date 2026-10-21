import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ShoppingBag, ExternalLink, Phone, CheckCircle2, X, Plus, Minus, Trash2, PlusCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../data';
import { Product } from '../types';

interface OrderItem {
  product: Product;
  quantity: number;
}

const slugifyCategory = (category: string) => {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

interface ProductKatalogProps {
  onProductClick?: (product: Product) => void;
  forcedOpenOrderWithProduct?: Product | null;
  clearForcedOpenOrder?: () => void;
}

export default function ProductKatalog({ onProductClick, forcedOpenOrderWithProduct, clearForcedOpenOrder }: ProductKatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ✅ STATE BARU: Data produk dari API
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Cart/Order list states
  const [orderedItems, setOrderedItems] = useState<OrderItem[]>([]);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [targetProductToAdd, setTargetProductToAdd] = useState<string>('');

  const categories = ['Semua', 'PEMBASMI HAMA GUDANG', 'PEMBASMI NYAMUK LALAT', 'PEMBASMI RAYAP', 'PEMBASMI TIKUS', 'ALAT PEMBASMI HAMA'];

  // ✅ EFEK BARU: Fetch data produk dari API backend
  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat produk');
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch(err => {
        console.error('Error loading products:', err);
        setLoadingProducts(false);
      });
  }, []);

  // Handle URL Category synchronisation
  useEffect(() => {
    const parseUrlCategory = () => {
      const pathname = window.location.pathname;
      const match = pathname.match(/^\/kategori\/(\d+)/);
      if (match) {
        const index = parseInt(match[1], 10);
        if (index >= 0 && index < categories.length) {
          setSelectedCategory(categories[index]);
          return;
        }
      }
      setSelectedCategory('Semua');
    };

    parseUrlCategory();

    window.addEventListener('popstate', parseUrlCategory);
    return () => {
      window.removeEventListener('popstate', parseUrlCategory);
    };
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const index = categories.indexOf(category);
    if (category === 'Semua') {
      window.history.pushState(null, '', '/');
    } else {
      const slug = slugifyCategory(category);
      window.history.pushState(null, '', `/kategori/${index}/${slug}`);
    }
  };

  // ✅ UBAH: Gunakan state 'products' bukan 'PRODUCTS' statis
  const filteredProducts = selectedCategory === 'Semua'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleStartOrder = (product: Product) => {
    setOrderedItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    setIsOrderFormOpen(true);
  };

  // Listen to forced orders from detail views external to the catalog
  useEffect(() => {
    if (forcedOpenOrderWithProduct) {
      handleStartOrder(forcedOpenOrderWithProduct);
      if (clearForcedOpenOrder) {
        clearForcedOpenOrder();
      }
    }
  }, [forcedOpenOrderWithProduct]);

  const handleUpdateQuantity = (productId: string, val: number) => {
    setOrderedItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, val);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId: string) => {
    setOrderedItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // ✅ UBAH: Gunakan state 'products' bukan 'PRODUCTS' statis
  const handleAddAdditionalProduct = () => {
    if (!targetProductToAdd) return;
    const prodToAdd = products.find(p => p.id === targetProductToAdd);
    if (prodToAdd) {
      setOrderedItems(prev => {
        const existing = prev.find(item => item.product.id === prodToAdd.id);
        if (existing) return prev;
        return [...prev, { product: prodToAdd, quantity: 1 }];
      });
      setTargetProductToAdd('');
    }
  };

  const handleSendWAWholeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderedItems.length === 0) {
      alert("Daftar pesanan Anda masih kosong.");
      return;
    }
    if (!customerName || !customerAddress) {
      alert("Silakan lengkapi Nama Penerima dan Alamat Pengiriman Anda.");
      return;
    }

    let itemsText = '';
    let grandTotal = 0;
    orderedItems.forEach((item, idx) => {
      const itemSubtotal = item.product.price * item.quantity;
      grandTotal += itemSubtotal;
      itemsText += `${idx + 1}. *${item.product.name}*\n   - Kategori: ${item.product.category}\n   - Kemasan: ${item.product.packaging || 'Default'}\n   - Harga Satuan: Rp ${item.product.price.toLocaleString('id-ID')}\n   - Jumlah Qty: *${item.quantity}*\n   - Subtotal: Rp ${itemSubtotal.toLocaleString('id-ID')}\n\n`;
    });

    const fullMessage = `Halo Tani Makmur Bersama,\n\nSaya ingin memesan produk berikut via WhatsApp Direct:\n\n${itemsText}*Total Estimasi Harga:* Rp ${grandTotal.toLocaleString('id-ID')}\n\n*Detail Penerima:*\n- *Nama:* ${customerName}\n- *Alamat:* ${customerAddress}\n- *Catatan:* ${customerNotes || '-'}\n\nMohon bantu siapkan rincian harga utama dan estimasi biaya kargo pengiriman. Terima kasih!`;
    
    const waUrl = `https://wa.me/628155071697?text=${encodeURIComponent(fullMessage)}`;
    window.open(waUrl, '_blank');
  };

  // ✅ UBAH: Gunakan state 'products' bukan 'PRODUCTS' statis
  const availableToAddNew = products.filter(
    p => !orderedItems.some(item => item.product.id === p.id)
  );

  // ✅ Loading state saat fetch data
  if (loadingProducts) {
    return (
      <section id="produk" className="py-24 sm:py-32 bg-brand-dark border-t border-brand-secondary/10 relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-brand-accent text-lg">Memuat produk...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="produk" className="py-24 sm:py-32 bg-brand-dark border-t border-brand-secondary/10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(22,101,52,0.04),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4 max-w-3xl mb-12 sm:mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2] text-brand-accent bg-gradient-to-r from-brand-accent to-amber-500 bg-clip-text text-transparent block" 
            id="catalog-label"
          >
            KATALOG PRODUK
          </motion.span>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-slate-900 tracking-tight lettercase" id="portfolio-title">
            Portofolio
          </h2>
          <p className="text-slate-600 font-sans tracking-wide text-base sm:text-lg">
            Menyediakan obat-obatan pertanian berkualitas dan peralatan pengendali hama terlengkap untuk mendampingi masa panen dan menjaga sterilitas lingkungan Anda.
          </p>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-12 pb-2 border-b border-brand-secondary/10" id="category-filters-container">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-5 py-2.5 rounded text-xs font-heading font-semibold tracking-widest uppercase transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-brand-secondary text-white shadow-md border-b-2 border-brand-accent'
                  : 'text-slate-600 hover:text-brand-secondary bg-brand-primary border border-brand-secondary/10 hover:border-brand-secondary/40'
              }`}
              id={`filter-btn-${category.toLowerCase()}`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* ✅ Tampilkan pesan jika tidak ada produk */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-brand-secondary/30 rounded-xl">
            <p className="text-gray-400 text-lg">Tidak ada produk di kategori "{selectedCategory}"</p>
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            id="products-grid-container"
          >
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white border border-brand-secondary/10 hover:border-brand-accent rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
                id={`product-card-${product.id}`}
              >
                  {/* Product Image Area */}
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] font-heading font-extrabold tracking-widest text-[#ea580c] uppercase border border-brand-accent/20">
                      {product.category}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-heading font-extrabold text-slate-800 group-hover:text-brand-accent transition-colors text-base sm:text-lg tracking-wide uppercase line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {product.description}
                      </p>
                      
                      {/* Compact Specs summary */}
                      <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
                        {product.pestTarget && (
                          <span className="bg-brand-primary text-slate-700 px-2.5 py-1 rounded border border-brand-secondary/10">
                            🎯 Target: {product.pestTarget}
                          </span>
                        )}
                        {product.packaging && (
                          <span className="bg-brand-primary text-slate-700 px-2.5 py-1 rounded border border-brand-secondary/10">
                            📦 {product.packaging}
                          </span>
                        )}
                      </div>

                      {/* Price display tag */}
                      <div className="pt-3 border-t border-brand-secondary/15 flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
                          Harga
                        </span>
                        <span className="text-sm font-heading font-black text-brand-accent tracking-wide">
                          Rp {product.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Buttons Action */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-brand-secondary/10">
                      <button
                        onClick={() => {
                          if (onProductClick) {
                            onProductClick(product);
                          } else {
                            setSelectedProduct(product);
                          }
                        }}
                        className="inline-flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-brand-secondary hover:text-white border border-brand-secondary/20 py-2.5 px-3 rounded-sm text-[10px] font-heading font-bold tracking-widest uppercase transition-colors"
                        id={`btn-product-detail-${product.id}`}
                      >
                        LIHAT DETIL
                      </button>
                      <button
                        onClick={() => handleStartOrder(product)}
                        className="inline-flex items-center justify-center space-x-1.5 bg-brand-accent text-white hover:bg-brand-accent/90 py-2.5 px-3 rounded-sm text-[10px] font-heading font-black tracking-widest uppercase cursor-pointer"
                        id={`btn-product-wa-${product.id}`}
                      >
                        <Phone className="w-3.5 h-3.5 fill-current text-white animate-pulse" />
                        <span>BELI SEKARANG</span>
                      </button>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Sheet Modal Overlay */}
        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm"
              id="product-detail-modal"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-zinc-950/98 border border-brand-secondary/40 w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-10 text-gray-400 hover:text-brand-accent p-2 rounded bg-brand-primary/20 border border-brand-secondary/35 focus:outline-none"
                  id="btn-close-modal"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="overflow-y-auto flex-grow">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
                    
                    {/* Left image area */}
                    <div className="md:col-span-5 relative h-64 md:h-full min-h-[250px] rounded-lg overflow-hidden bg-brand-primary/10 flex items-center justify-center">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain p-2"
                      />
                      <div className="absolute top-3 left-3 bg-emerald-700 text-white px-3 py-1 rounded text-[9px] font-heading font-extrabold tracking-widest uppercase">
                        {selectedProduct.category}
                      </div>
                    </div>

                    {/* Right core info text */}
                    <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-xl sm:text-2xl font-heading font-black text-brand-accent tracking-wide uppercase leading-snug">
                          {selectedProduct.name}
                        </h3>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs border-y border-brand-secondary/20 py-3">
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-mono">Formulasi</span>
                            <span className="text-gray-200 font-semibold block truncate">{selectedProduct.formulation || "Konsentrat Emulsi"}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-mono">Kemasan</span>
                            <span className="text-gray-200 font-semibold block truncate">{selectedProduct.packaging || "Botol Aluminium"}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block text-[10px] uppercase font-mono">Harga</span>
                            <span className="text-brand-accent font-black block text-sm">Rp {selectedProduct.price.toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 leading-relaxed font-sans">
                          {selectedProduct.description}
                        </p>

                        <div className="space-y-2 mt-4">
                          <span className="text-[10px] font-mono tracking-widest text-[#cccccc] block uppercase">
                            KEUNGGULAN PRODUK
                          </span>
                          <div className="space-y-2">
                            {selectedProduct.features && selectedProduct.features.length > 0 ? (
                              selectedProduct.features.map((feat, i) => (
                                <div key={i} className="flex items-start space-x-2 text-xs text-gray-300">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-gray-500">Tidak ada fitur tambahan.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Store Redirect Options */}
                      <div className="pt-6 border-t border-brand-secondary/20 space-y-4">
                        <span className="text-[10px] font-mono tracking-widest text-brand-accent block uppercase">
                          BELI DI MEDIA LAPAK RESMI BERSERTIFIKAT
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            onClick={() => {
                              const p = selectedProduct;
                              setSelectedProduct(null);
                              handleStartOrder(p);
                            }}
                            className="inline-flex items-center justify-center space-x-2 bg-[#25d366]/10 hover:bg-[#25d366] text-[#25d366] hover:text-brand-dark font-extrabold text-xs py-3 rounded uppercase border border-[#25d366]/40 transition-colors cursor-pointer"
                          >
                            <Phone className="w-4 h-4 text-inherit animate-pulse" />
                            <span>PESAN VIA WA DIRECT</span>
                          </button>
                          <a
                            href={BUSINESS_INFO.shopeeUrl1}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center space-x-2 bg-[#ee4d2d]/10 hover:bg-[#ee4d2d] text-[#ee4d2d] hover:text-white font-extrabold text-xs py-3 rounded uppercase border border-[#ee4d2d]/40 transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4 text-inherit" />
                            <span>SHOPEE LAPAK UTAMA</span>
                          </a>
                          <a
                            href={BUSINESS_INFO.shopeeUrl2}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center space-x-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-300 hover:text-white font-extrabold text-xs py-3 rounded uppercase border border-emerald-500/40 transition-colors"
                          >
                            <ShoppingCart className="w-4 h-4 text-inherit" />
                            <span>SHOPEE LAPAK MITRA</span>
                          </a>
                          <a
                            href={BUSINESS_INFO.lazadaUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center space-x-2 bg-[#000080]/10 hover:bg-[#000080] text-[#000080] hover:text-white font-extrabold text-xs py-3 rounded uppercase border border-[#000080]/40 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-inherit" />
                            <span>LAZADA OFFICIAL</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Order & Quantity Form Modal */}
        <AnimatePresence>
          {isOrderFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-sm"
              id="order-form-modal"
              onClick={() => setIsOrderFormOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-zinc-950/98 border border-brand-secondary/40 w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Title with Cart Close */}
                <div className="flex items-center justify-between p-6 border-b border-brand-secondary/20">
                  <div className="flex items-center space-x-2.5">
                    <div className="bg-brand-accent/20 border border-brand-accent/45 p-1.5 rounded text-brand-accent">
                      <ShoppingCart className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-extrabold text-[#fdfbf7] tracking-wide uppercase">
                        Form Jumlah Pesanan
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                        Ubah Jumlah, Tambah Barang & Kirim WA Direct
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOrderFormOpen(false)}
                    className="text-gray-400 hover:text-brand-accent p-2 rounded bg-brand-primary/20 border border-brand-secondary/35 focus:outline-none cursor-pointer"
                    aria-label="Tutup edit"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6 flex-grow">
                  {/* Current Items List */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono tracking-widest text-brand-accent block uppercase font-bold">
                      DAFTAR BELANJA ({orderedItems.length} BARANG)
                    </span>
                    
                    {orderedItems.length === 0 ? (
                      <div className="py-8 text-center border border-dashed border-brand-secondary/35 rounded-xl text-gray-500 text-xs">
                        Belum ada barang dipilih. Silakan pilih menu tambah di bawah ini.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orderedItems.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-center justify-between p-3.5 bg-brand-primary/10 border border-brand-secondary/20 hover:border-brand-secondary/40 rounded-lg transition-all"
                            id={`order-item-row-${item.product.id}`}
                          >
                            <div className="flex items-center space-x-3 min-w-0 flex-grow pr-2">
                              {/* Small thumb */}
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-12 h-12 rounded object-cover border border-brand-secondary/30 shrink-0"
                              />
                              <div className="min-w-0">
                                <h4 className="font-heading font-extrabold text-xs text-gray-100 truncate uppercase tracking-wide">
                                  {item.product.name}
                                </h4>
                                <span className="text-[10px] text-gray-400 block font-mono">
                                  {item.product.packaging || "Kemasan Standar"} &bull; Rp {item.product.price.toLocaleString('id-ID')}
                                </span>
                                {item.quantity > 1 && (
                                  <span className="text-[10px] text-brand-accent block font-mono font-bold mt-0.5">
                                    Subtotal: Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity Editor Controls */}
                            <div className="flex items-center space-x-3 shrink-0">
                              <div className="flex items-center bg-brand-dark border border-brand-secondary/40 rounded overflow-hidden flex-row">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                  className="px-2 py-1.5 text-gray-400 hover:text-brand-accent hover:bg-brand-primary/20 transition-colors"
                                  aria-label="Kurang satu"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <input
                                  type="text"
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                                  className="w-10 bg-transparent text-center text-xs font-bold text-white focus:outline-none border-x border-brand-secondary/25"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="px-2 py-1.5 text-gray-400 hover:text-brand-accent hover:bg-brand-primary/20 transition-colors"
                                  aria-label="Tambah satu"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Remove Item completely */}
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.product.id)}
                                className="text-gray-500 hover:text-red-400 p-2 rounded hover:bg-brand-primary/15 transition-colors"
                                title="Hapus dari daftar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Grand Total Display */}
                        <div className="mt-4 p-3.5 bg-brand-secondary/15 border border-brand-secondary/30 rounded-lg flex items-center justify-between text-xs font-semibold text-white shadow-inner">
                          <span className="uppercase font-mono tracking-widest text-gray-300">Total Estimasi Harga</span>
                          <span className="text-sm font-heading font-black text-brand-accent">
                            Rp {orderedItems.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add More Items Panel inside Cart */}
                  <div className="p-4 bg-brand-primary/15 border border-brand-secondary/20 rounded-xl space-y-3">
                    <span className="text-[10px] font-mono tracking-widest text-[#eeeeee] block uppercase font-bold">
                      ➕ TAMBAH BARANG LAIN KE DAFTAR PESANAN
                    </span>
                    <div className="flex gap-2.5">
                      <select
                        value={targetProductToAdd}
                        onChange={(e) => setTargetProductToAdd(e.target.value)}
                        className="flex-grow bg-brand-dark border border-brand-secondary/40 rounded p-2.5 text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="">-- Cari & Pilih Produk Lain --</option>
                        {availableToAddNew.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            [{prod.category}] {prod.name} - Rp {prod.price.toLocaleString('id-ID')}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddAdditionalProduct}
                        disabled={!targetProductToAdd}
                        className="inline-flex items-center space-x-1 bg-brand-accent hover:bg-brand-accent/90 disabled:bg-brand-accent/40 text-brand-dark font-heading font-black text-xs px-4 py-2.5 rounded transition-all uppercase shrink-0 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>TAMBAH</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer Checkout Delivery Information */}
                  <form onSubmit={handleSendWAWholeOrder} className="space-y-4 pt-2">
                    <span className="text-[10px] font-mono tracking-widest text-brand-accent block uppercase font-bold">
                      INFO DETAIL PENERIMA & LOKASI PENGIRIMAN
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 block">NAMA PENERIMA *</label>
                        <input
                          type="text"
                          required
                          placeholder="Nama lengkap Anda..."
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-brand-dark border border-brand-secondary/40 focus:border-brand-accent rounded p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-gray-400 block">KOTA & PROVINSI TUJUAN *</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Denpasar, Bali"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          className="w-full bg-brand-dark border border-brand-secondary/40 focus:border-brand-accent rounded p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-gray-400 block font-normal">CATATAN TAMBAHAN (OPSIONAL)</label>
                      <textarea
                        rows={2}
                        placeholder="Contoh: Kirim secepatnya / Minta kargo laut termurah..."
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        className="w-full bg-brand-dark border border-brand-secondary/40 focus:border-brand-accent rounded p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Order Details directly to WA */}
                    <div className="pt-4 border-t border-brand-secondary/15 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => setIsOrderFormOpen(false)}
                        className="w-full sm:w-1/3 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white border border-brand-secondary/45 py-3.5 px-4 rounded text-xs font-heading font-bold tracking-widest uppercase transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-2/3 inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black tracking-widest text-xs py-3.5 px-4 rounded transition-all uppercase shadow-lg shadow-emerald-500/10 active:scale-95 cursor-pointer"
                      >
                        <Phone className="w-4 h-4 text-white animate-bounce" />
                        <span>KIRIM RINCIAN KE WHATSAPP</span>
                      </button>
                    </div>

                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}