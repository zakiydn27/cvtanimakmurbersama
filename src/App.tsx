/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [forcedProductOrder, setForcedProductOrder] = useState<Product | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        JSON.parse(storedUser);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Router click handler
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

  // Navigate to Login page
  const handleNavigateToLogin = () => {
    setCurrentPage('login');
    setSelectedArticle(null);
    setSelectedProduct(null);
    window.history.pushState(null, '', '/login');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Navigate to Profile page
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

  // Navigate to Cart page
  const handleNavigateToCart = () => {
    setCurrentPage('cart');
    setSelectedArticle(null);
    setSelectedProduct(null);
    window.history.pushState(null, '', '/cart');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Navigate to Register page
  const handleNavigateToRegister = () => {
    setCurrentPage('register');
    setSelectedArticle(null);
    setSelectedProduct(null);
    window.history.pushState(null, '', '/register');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Back to Home
  const handleBackToHome = () => {
    setCurrentPage('home');
    setActiveSection('beranda');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    handleBackToHome();
  };

  // Handle checkout dari cart
  const handleCheckout = () => {
    if (!isLoggedIn) {
      alert('Silakan login terlebih dahulu untuk checkout');
      setCurrentPage('login');
      window.history.pushState(null, '', '/login');
    } else {
      alert('Fitur checkout akan segera diimplementasikan. Terima kasih!');
      // Di sini bisa redirect ke halaman checkout
      // setCurrentPage('checkout');
    }
  };

  // Synchronise state with URL changes (on popstate back/forward or initial load)
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname;

      // Handle login page
      if (path === '/login') {
        setCurrentPage('login');
        setSelectedArticle(null);
        setSelectedProduct(null);
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }

      // Handle register page
      if (path === '/register') {
        setCurrentPage('register');
        setSelectedArticle(null);
        setSelectedProduct(null);
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }

      // Handle profile page
      if (path === '/profile') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setIsLoggedIn(true);
          setCurrentPage('profile');
          setSelectedArticle(null);
          setSelectedProduct(null);
          window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
          setCurrentPage('login');
          window.history.replaceState(null, '', '/login');
        }
        return;
      }

      // Handle cart page
      if (path === '/cart') {
        setCurrentPage('cart');
        setSelectedArticle(null);
        setSelectedProduct(null);
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }

      // Handle category pages
      if (path.startsWith('/kategori/')) {
        setCurrentPage('home');
        setSelectedArticle(null);
        setSelectedProduct(null);
        setActiveSection('produk');
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }

      // Handle regular sections
      setCurrentPage('home');
      const sectionId = path === '/' ? 'beranda' : path.slice(1);
      const validSections = ['beranda', 'produk', 'proses', 'keunggulan', 'artikel', 'kontak'];

      if (validSections.includes(sectionId)) {
        setSelectedArticle(null);
        setSelectedProduct(null);
        setActiveSection(sectionId);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, []);

  // Wrap seluruh aplikasi dengan CartProvider
  return (
    <CartProvider>
      {/* Render Login Page */}
      {currentPage === 'login' && (
        <div className="bg-brand-dark min-h-screen text-slate-700 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden antialiased">
          <LoginPage
            key="Login" 
            onBack={handleBackToHome}
            onNavigateToRegister={handleNavigateToRegister}
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      )}

      {/* Render Register Page */}
      {currentPage === 'register' && (
        <div className="bg-brand-dark min-h-screen text-slate-700 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden antialiased">
          <RegisterPage 
            onBack={handleBackToHome}
            onNavigateToLogin={handleNavigateToLogin}
          />
        </div>
      )}

      {/* Render Profile Page */}
      {currentPage === 'profile' && (
        <div className="bg-brand-dark min-h-screen text-slate-700 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden antialiased">
          <ProfilePage onBack={handleBackToHome} onLogout={handleLogout} />
        </div>
      )}

      {currentPage === 'cart' && (
        <CartPage 
          key="cart" 
          onBack={handleBackToHome} 
          onCheckout={handleCheckout}
          onNavigateToLogin={handleNavigateToLogin}  
        />
      )}

      {/* Render Home Page (default) */}
      {currentPage === 'home' && (
        <div className="bg-brand-dark min-h-screen text-slate-700 font-sans selection:bg-brand-accent selection:text-white overflow-x-hidden antialiased flex flex-col justify-between">
          {/* 1. TOP HEADER NAVIGATION */}
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

          {/* 2. DYNAMIC CONTENT AREA */}
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

          {/* 3. BRAND FOOTER */}
          <Footer onNavClick={handleNavClick} />
        </div>
      )}
    </CartProvider>
  );
}