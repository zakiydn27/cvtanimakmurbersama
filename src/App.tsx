import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // ✅ TAMBAHKAN INI
import Header from './components/Header';
import Hero from './components/Hero';
import ProductKatalog from './components/ProductKatalog';
import { AdvantagesSection } from './components/CompanyValue';
import ArticlesSection from './components/ArticlesSection';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import ArticleDetailPage from './components/ArticleDetailPage';
import ProductDetailPage from './components/ProductDetailPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage'; 
import CartPage from './components/CartPage';
import { CartProvider } from './components/CartContext';
import { Article, Product } from './types';

type Page = 'home' | 'login' | 'register' | 'profile' | 'cart';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [activeSection, setActiveSection] = useState('beranda');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null); // ✅ TAMBAHKAN state user
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [forcedProductOrder, setForcedProductOrder] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true); // ✅ TAMBAHKAN loading state

  // ✅ PERBAIKAN 1: Sinkronisasi dengan Supabase Auth
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        setUser(session.user);
      }
      setLoading(false);
    };

    checkSession();

    // ✅ Listen perubahan auth state (real-time sync dengan admin)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setIsLoggedIn(true);
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setUser(null);
          if (currentPage === 'profile') {
            handleBackToHome();
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const handleNavigateToLogin = () => {
    setCurrentPage('login');
    setSelectedArticle(null);
    setSelectedProduct(null);
    window.history.pushState(null, '', '/login');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // ✅ PERBAIKAN 2: Login success ambil session dari Supabase
  const handleLoginSuccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setIsLoggedIn(true);
      setUser(session.user);
    }
    setCurrentPage('home');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateToProfile = () => {
    if (!isLoggedIn) {
      handleNavigateToLogin();
      return;
    }
    setCurrentPage('profile');
    setSelectedArticle(null);
    setSelectedProduct(null);
    window.history.pushState(null, '', '/profile');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateToCart = () => {
    setCurrentPage('cart');
    setSelectedArticle(null);
    setSelectedProduct(null);
    window.history.pushState(null, '', '/cart');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateToRegister = () => {
    setCurrentPage('register');
    setSelectedArticle(null);
    setSelectedProduct(null);
    window.history.pushState(null, '', '/register');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setActiveSection('beranda');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // ✅ PERBAIKAN 3: Logout via Supabase (sinkron dengan admin)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    handleBackToHome();
  };

  // ✅ PERBAIKAN 4: Implementasi Checkout yang SEBENARNYA
  const handleCheckout = async (orderData: {
    items: Array<{ productId: string; quantity: number }>;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    shippingAddress: string;
    notes?: string;
  }) => {
    if (!isLoggedIn) {
      alert('Silakan login terlebih dahulu untuk checkout');
      handleNavigateToLogin();
      return;
    }

    try {
      let totalAmount = 0;
      const orderItems = [];

      // Hitung total & validasi stok
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

      // Simpan order ke Supabase
      const { data: order, error } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail || user?.email,
          customer_phone: orderData.customerPhone,
          customer_address: orderData.shippingAddress,
          items: orderItems,
          total_price: totalAmount,
          status: 'pending',
          notes: orderData.notes || ''
        }])
        .select()
        .single();

      if (error) throw error;

      // Kurangi stok produk
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

      if (path === '/login') {
        setCurrentPage('login');
        setSelectedArticle(null);
        setSelectedProduct(null);
        return;
      }

      if (path === '/register') {
        setCurrentPage('register');
        setSelectedArticle(null);
        setSelectedProduct(null);
        return;
      }

      if (path === '/profile') {
        if (isLoggedIn) {
          setCurrentPage('profile');
        } else {
          setCurrentPage('login');
          window.history.replaceState(null, '', '/login');
        }
        setSelectedArticle(null);
        setSelectedProduct(null);
        return;
      }

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
  }, [isLoggedIn]);

  // ✅ PERBAIKAN 5: Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-brand-accent text-lg animate-pulse">Memuat aplikasi...</div>
      </div>
    );
  }

  return (
    <CartProvider>
      {currentPage === 'login' && (
        <div className="bg-brand-dark min-h-screen text-slate-700 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden antialiased">
          <LoginPage
            onBack={handleBackToHome}
            onNavigateToRegister={handleNavigateToRegister}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}

      {currentPage === 'register' && (
        <div className="bg-brand-dark min-h-screen text-slate-700 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden antialiased">
          <RegisterPage 
            onBack={handleBackToHome}
            onNavigateToLogin={handleNavigateToLogin}
          />
        </div>
      )}

      {currentPage === 'profile' && (
        <div className="bg-brand-dark min-h-screen text-slate-700 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden antialiased">
          <ProfilePage 
            onBack={handleBackToHome} 
            onLogout={handleLogout} 
          />
        </div>
      )}

      {currentPage === 'cart' && (
        <CartPage 
          onBack={handleBackToHome} 
          onNavigateToLogin={handleNavigateToLogin}
        />
      )}

      {currentPage === 'home' && (
        <div className="bg-brand-dark min-h-screen text-slate-700 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden antialiased flex flex-col">
          <Header 
            activeSection={selectedArticle ? 'artikel' : selectedProduct ? 'produk' : activeSection} 
            onNavClick={handleNavClick}
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToRegister={handleNavigateToRegister}
            onNavigateToProfile={handleNavigateToProfile}
            onNavigateToCart={handleNavigateToCart}
            onLogout={handleLogout}
            isLoggedIn={isLoggedIn}
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