import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductKatalog from './components/ProductKatalog';
import { AdvantagesSection } from './components/CompanyValue';
import ArticlesSection from './components/ArticlesSection';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ArticleDetailPage from './components/ArticleDetailPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import { CartProvider } from './components/CartContext';
import { Article, Product } from './types';

// ✅ HAPUS 'register' dan 'profile' dari type
type Page = 'home' | 'cart';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeSection, setActiveSection] = useState('beranda');
  
  // ✅ HAPUS state isLoggedIn, user, dan loading
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [forcedProductOrder, setForcedProductOrder] = useState<Product | null>(null);

  // Router handlers
  const handleNavClick = (sectionId: string, skipPushState = false) => {
    setSelectedArticle(null);
    setSelectedProduct(null);
    setActiveSection(sectionId);
    setCurrentPage('home');
    
    if (!skipPushState) {
      const destinationPath = sectionId === 'beranda' ? '/' : `/${sectionId}`;
      window.history.pushState(null, '', destinationPath);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateToCart = () => {
    setCurrentPage('cart');
    setSelectedArticle(null);
    setSelectedProduct(null);
    window.history.pushState(null, '', '/cart');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setActiveSection('beranda');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // ✅ CHECKOUT TAMPA LOGIN (Guest Checkout)
  const handleCheckout = async (orderData: {
    items: Array<{ productId: string; quantity: number }>;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    shippingAddress: string;
    notes?: string;
  }) => {
    try {
      let totalAmount = 0;
      const orderItems = [];

      // 1. Hitung total & validasi stok real-time
      for (const item of orderData.items) {
        const { data: product, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', item.productId)
          .single();

        if (error || !product) {
          throw new Error(`Produk tidak ditemukan`);
        }

        if (product.stok < item.quantity) {
          throw new Error(`Stok ${product.name} tidak cukup (tersisa: ${product.stok})`);
        }

        totalAmount += product.price * item.quantity;
        orderItems.push({
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        });
      }

      // 2. Simpan order ke Supabase (tanpa user_id, murni guest)
      const { error } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail || 'guest@email.com',
          customer_phone: orderData.customerPhone,
          customer_address: orderData.shippingAddress,
          items: orderItems,
          total_price: totalAmount,
          status: 'pending',
          notes: orderData.notes || ''
        }]);

      if (error) throw error;

      // 3. Kurangi stok produk di database
      for (const item of orderItems) {
        const { data: product } = await supabase
          .from('products')
          .select('stok')
          .eq('id', item.product_id)
          .single();

        if (product) {
          await supabase
            .from('products')
            .update({ stok: product.stok - item.quantity })
            .eq('id', item.product_id);
        }
      }

      alert('✅ Pesanan berhasil dibuat! Kami akan segera menghubungi Anda.');
      handleBackToHome();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('❌ Gagal membuat pesanan: ' + (error as Error).message);
    }
  };

  // URL Routing
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;

      if (path === '/cart') {
        setCurrentPage('cart');
        setSelectedArticle(null);
        setSelectedProduct(null);
        return;
      }

      if (path.startsWith('/kategori/')) {
        setCurrentPage('home');
        setSelectedArticle(null);
        setSelectedProduct(null);
        setActiveSection('produk');
        return;
      }

      setCurrentPage('home');
      const sectionId = path === '/' ? 'beranda' : path.slice(1);
      const validSections = ['beranda', 'produk', 'proses', 'keunggulan', 'artikel', 'kontak'];

      if (validSections.includes(sectionId)) {
        setSelectedArticle(null);
        setSelectedProduct(null);
        setActiveSection(sectionId);
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, []); // ✅ Hapus dependency isLoggedIn

  return (
    <CartProvider>
      {/* ✅ RENDER CART PAGE */}
      {currentPage === 'cart' && (
        <CartPage 
          onBack={handleBackToHome} 
          // ✅ HAPUS onNavigateToLogin dari sini
        />
      )}

      {/* ✅ RENDER HOME PAGE */}
      {currentPage === 'home' && (
        <div className="bg-brand-dark min-h-screen text-slate-700 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden antialiased flex flex-col">
        <Header 
          activeSection={selectedArticle ? 'artikel' : selectedProduct ? 'produk' : activeSection} 
          onNavClick={handleNavClick}
          onNavigateToCart={handleNavigateToCart}
        />

          <main id="main-content-flow" className="pt-20 flex-1 flex flex-col justify-center">
            {selectedArticle ? (
              <ArticleDetailPage 
                article={selectedArticle} 
                onBack={() => {
                  setSelectedArticle(null);
                  window.history.pushState(null, '', '/artikel');
                }}
                onNavigateToArticle={(nextArticle) => setSelectedArticle(nextArticle)}
              />
            ) : selectedProduct ? (
              <ProductDetailPage 
                product={selectedProduct}
                onBack={() => {
                  setSelectedProduct(null);
                  window.history.pushState(null, '', '/produk');
                }}
                onNavigateToProduct={(nextProduct) => setSelectedProduct(nextProduct)}
                onOrderProduct={(prod) => {
                  setForcedProductOrder(prod);
                  setSelectedProduct(null);
                  window.history.pushState(null, '', '/produk');
                }}
              />
            ) : (
              <>
                {activeSection === 'beranda' && (
                  <Hero onLearnMoreClick={() => handleNavClick('produk')} />
                )}

                {activeSection === 'produk' && (
                  <ProductKatalog 
                    onProductClick={(product) => setSelectedProduct(product)}
                    forcedOpenOrderWithProduct={forcedProductOrder}
                    clearForcedOpenOrder={() => setForcedProductOrder(null)}
                  />
                )}

                {activeSection === 'keunggulan' && (
                  <AdvantagesSection />
                )}

                {activeSection === 'artikel' && (
                  <ArticlesSection onArticleClick={(article) => setSelectedArticle(article)} />
                )}

                {activeSection === 'kontak' && (
                  <ContactForm />
                )}
              </>
            )}
          </main>

          <Footer onNavClick={handleNavClick} />
        </div>
      )}
    </CartProvider>
  );
}