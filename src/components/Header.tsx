import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ShoppingCart } from 'lucide-react';
import { BUSINESS_INFO } from '../data';
import { useCart } from '../components/CartContext';

// ✅ Interface disederhanakan - hapus semua props auth
interface HeaderProps {
  activeSection: string;
  onNavClick: (sectionId: string) => void;
  onNavigateToCart: () => void;
}

export default function Header({ 
  activeSection, 
  onNavClick, 
  onNavigateToCart
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'BERANDA', id: 'beranda' },
    { label: 'PRODUK', id: 'produk' },
    { label: 'KEUNGGULAN', id: 'keunggulan' },
    { label: 'ARTIKEL', id: 'artikel' },
    { label: 'KONTAK', id: 'kontak' }
  ];

  const handleItemClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavClick(id);
  };

  return (
    <>
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-brand-dark/95 backdrop-blur-md border-b border-brand-secondary/15 py-3 shadow-md'
            : 'bg-brand-dark/80 backdrop-blur-sm border-b border-brand-secondary/10 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo area */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleItemClick('beranda')}
              id="header-brand-logo"
            >
              <div className="bg-brand-secondary text-white font-black px-2.5 py-1.5 rounded text-sm sm:text-base tracking-wider transition-all duration-300 group-hover:bg-brand-accent shadow-inner flex items-center justify-center">
                TM
              </div>
              <span className="font-heading font-extrabold tracking-widest text-brand-secondary text-sm sm:text-lg group-hover:text-brand-accent transition-colors">
                TANI MAKMUR
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8" id="desktop-nav">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-xs font-heading font-semibold tracking-widest transition-all duration-200 relative py-1 hover:text-brand-accent ${
                    activeSection === item.id
                      ? 'text-brand-accent font-bold'
                      : 'text-slate-700'
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-brand-accent rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* ✅ Hanya Tombol Keranjang (Tanpa Auth) */}
            <div className="hidden sm:flex items-center space-x-3" id="desktop-cart-button">
              <button
                onClick={onNavigateToCart}
                className="relative inline-flex items-center space-x-2 bg-transparent hover:bg-brand-accent text-brand-secondary hover:text-white border border-brand-secondary hover:border-brand-accent transition-all duration-300 px-4 py-2 rounded-sm text-xs font-bold tracking-widest uppercase shadow-sm"
                id="btn-nav-cart"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>KERANJANG</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Cart Button */}
              <button
                onClick={onNavigateToCart}
                className="relative p-2 text-slate-700 hover:text-brand-accent transition-colors"
                id="btn-mobile-cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-700 hover:text-brand-secondary focus:outline-none p-1.5 rounded bg-brand-primary border border-brand-secondary/20"
                aria-label="Toggle menu"
                id="btn-mobile-menu-toggle"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-brand-accent" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          id="mobile-nav-drawer"
          className={`lg:hidden fixed inset-x-0 top-[61px] m-4 bg-white border border-brand-secondary/15 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden transition-all duration-300 transform origin-top ${
            mobileMenuOpen
              ? 'opacity-100 scale-y-100 pointer-events-auto'
              : 'opacity-0 scale-y-95 pointer-events-none'
          }`}
        >
          <div className="px-5 py-6 space-y-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-heading font-semibold tracking-wider transition-all duration-150 ${
                    activeSection === item.id
                      ? 'bg-brand-primary text-brand-accent border-l-4 border-brand-accent'
                      : 'text-slate-700 hover:bg-brand-primary/50 hover:text-brand-secondary'
                  }`}
                  id={`mobile-nav-item-${item.id}`}
                >
                  <span>{item.label}</span>
                  <Globe className="w-4 h-4 opacity-30 text-brand-secondary" />
                </button>
              ))}
            </div>

            {/* ✅ Mobile Cart Button (Tanpa Auth) */}
            <div className="pt-4 border-t border-brand-secondary/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToCart();
                }}
                className="w-full flex items-center justify-center space-x-2 bg-brand-accent hover:bg-brand-accent/90 text-white font-heading font-extrabold tracking-widest text-xs py-3 rounded-lg uppercase shadow-md transition-all active:scale-95"
                id="btn-mobile-cart-menu"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>KERANJANG ({cartCount})</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}