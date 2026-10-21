import React from 'react';
import { ArrowUp, Instagram, Mail, MapPin, Phone, Shield } from 'lucide-react';
import { BUSINESS_INFO } from '../data';

interface FooterProps {
  onNavClick: (sectionId: string) => void;
}

export default function Footer({ onNavClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-dark text-slate-600 border-t border-brand-secondary/10 relative">
      <div className="absolute inset-0 bg-brand-primary/10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Upper Foot grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start pb-12 border-b border-brand-secondary/10" id="footer-upper-grid">
          
          {/* Logo & Identity info */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleScrollToTop}>
              <div className="bg-brand-secondary text-white font-black px-2.5 py-1.5 rounded text-xs tracking-wider shadow-sm">
                TM
              </div>
              <span className="font-heading font-extrabold tracking-widest text-slate-900 text-base group-hover:text-brand-accent transition-colors">
                TANI MAKMUR
              </span>
            </div>
            <p className="text-xs text-slate-600 font-sans leading-relaxed max-w-sm">
              Distributor pestisida, insektisida, herbisida, dan peralatan pengendali hama terlengkap dan terpercaya di Indonesia. Berkomitmen menopang ketahanan pangan dan kebersihan lingkungan komersial.
            </p>
            
            {/* Social media connections */}
            <div className="flex items-center space-x-3">
              <a href={BUSINESS_INFO.whatsappUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-brand-primary border border-brand-secondary/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-all text-slate-700 shadow-sm">
                <Phone className="w-4 h-4 text-emerald-800" />
              </a>
              <a href={BUSINESS_INFO.instagramUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-brand-primary border border-brand-secondary/10 flex items-center justify-center hover:bg-[#ea580c] hover:border-[#ea580c] hover:text-white transition-all text-slate-700 shadow-sm">
                <Instagram className="w-4 h-4 text-[#ea580c]" />
              </a>
              <a href={`mailto:${BUSINESS_INFO.email}`} className="w-8 h-8 rounded bg-brand-primary border border-brand-secondary/10 flex items-center justify-center hover:bg-brand-accent hover:border-brand-accent hover:text-white transition-all text-slate-700 shadow-sm">
                <Mail className="w-4 h-4 text-emerald-800" />
              </a>
            </div>
          </div>

          {/* Quick links indexes */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-brand-secondary uppercase">
              REDIREKSI NAVIGASI
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavClick('beranda')} className="text-slate-700 hover:text-brand-accent transition-colors text-left py-1">
                  Beranda Utama
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('produk')} className="text-slate-700 hover:text-brand-accent transition-colors text-left py-1">
                  Katalog Portofolio
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('proses')} className="text-slate-700 hover:text-brand-accent transition-colors text-left py-1">
                  Alur Pemesanan
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('keunggulan')} className="text-slate-700 hover:text-brand-accent transition-colors text-left py-1">
                  Keunggulan Layanan
                </button>
              </li>
            </ul>
          </div>

          {/* Business hour specifications */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#ea580c] uppercase">
              WAKTU OPERASIONAL & LAYANAN
            </h4>
            <div className="space-y-3 text-xs">
              <p className="text-slate-700">Senin - Sabtu: <span className="text-slate-900 font-semibold">08:00 - 17:00 WITA</span></p>
              <p className="text-slate-700">Minggu / Tanggal Merah: <span className="text-brand-accent font-semibold font-mono">TUTUP / WA SLOW RESPOND</span></p>
              
              <div className="pt-3 border-t border-brand-secondary/10 space-y-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-brand-secondary uppercase block">
                  ALAMAT UTAMA
                </span>
                <div className="flex items-start space-x-2 text-slate-700" id="footer-address-block">
                  <MapPin className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-slate-800 font-medium">
                    Jl. Pabean Asri Jl. Ferrari No.25 BLOK W, Pabean, Kec. Sedati, Kab Sidoarjo, 61253, Jawa Timur
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-secondary/10 flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                <Shield className="w-4 h-4 text-brand-secondary" />
                <span>AUTHORIZED PACKAGING & DISTRIBUTOR</span>
              </div>
            </div>
          </div>

        </div>

        {/* Lower footprint */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6" id="footer-lower-foot">
          <div className="text-xs text-slate-500 font-sans text-center sm:text-left">
            &copy; {currentYear} <span className="text-slate-700 font-semibold">{BUSINESS_INFO.name}</span>. Redesign Hak Cipta Dilindungi Undang-Undang.
          </div>
          
          {/* Scroll to Top Widget */}
          <div>
            <button
              onClick={handleScrollToTop}
              className="inline-flex items-center space-x-2 bg-brand-primary hover:bg-brand-accent border border-brand-secondary/10 hover:border-brand-accent text-brand-secondary hover:text-white transition-all duration-300 px-4 py-2.5 rounded-full text-xs font-heading font-black tracking-widest uppercase shadow-sm active:scale-95"
              id="btn-scroll-to-top"
              aria-label="Scroll back to top"
            >
              <span>KEMBALI KE ATAS</span>
              <ArrowUp className="w-3.5 h-3.5 animate-bounce" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
