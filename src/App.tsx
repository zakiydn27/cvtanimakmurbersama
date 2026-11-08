import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, MessageCircle, X } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ProductKatalog from './components/ProductKatalog';
import ProductDetailPage from './components/ProductDetailPage';
import { AdvantagesSection } from './components/CompanyValue';
import ArticlesSection from './components/ArticlesSection';
import ArticleDetailPage from './components/ArticleDetailPage';
import ContactForm from './components/ContactForm';
import CartPage from './components/CartPage';
import OfficialStorePage from './components/OfficialStorePage';
import { CartProvider, useCart } from './components/CartContext';
import { BUSINESS_INFO, formatRupiah } from './data';
import { Route, linkProps, useRoute } from './router';

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case 'home':
      return <HomePage />;
    case 'produk':
      return <ProductKatalog category={route.category} />;
    case 'detail':
      return <ProductDetailPage id={route.id} />;
    case 'keunggulan':
      return <AdvantagesSection />;
    case 'artikel':
      return <ArticlesSection />;
    case 'artikel-detail':
      return <ArticleDetailPage id={route.id} />;
    case 'kontak':
      return <ContactForm />;
    case 'official-store':
      return <OfficialStorePage />;
    case 'cart':
      return <CartPage />;
  }
}

/** Notifikasi kecil setiap ada produk masuk keranjang */
function CartToast() {
  const { lastAdded, cartCount } = useCart();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(t);
  }, [lastAdded]);

  return (
    <AnimatePresence>
      {visible && lastAdded && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="fixed right-4 top-28 z-[90] w-[calc(100%-2rem)] max-w-sm border border-line bg-white p-4 shadow-xl"
          role="status"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand">
              <Check className="h-4 w-4" /> Ditambahkan ke keranjang
            </span>
            <button onClick={() => setVisible(false)} aria-label="Tutup"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex gap-3">
            <img src={lastAdded.product.image} alt="" referrerPolicy="no-referrer" className="h-16 w-16 shrink-0 bg-soft object-cover" />
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-semibold">{lastAdded.product.name}</p>
              <p className="text-sm text-muted">{formatRupiah(lastAdded.product.price)}</p>
            </div>
          </div>
          <a
            {...linkProps('/cart', () => setVisible(false))}
            className="mt-4 block bg-ink py-3 text-center text-xs font-bold uppercase tracking-widest text-white hover:bg-brand"
          >
            Lihat Keranjang ({cartCount})
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const route = useRoute();

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-white font-sans text-ink antialiased selection:bg-brand selection:text-white">
        <Header route={route} />
        <main className="flex-1">
          <Page route={route} />
        </main>
        <Footer />
        <CartToast />
        <a
          href={BUSINESS_INFO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat WhatsApp"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
    </CartProvider>
  );
}
