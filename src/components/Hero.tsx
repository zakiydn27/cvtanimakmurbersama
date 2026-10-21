import React from 'react';
import { motion } from 'motion/react';
import { Phone, ArrowDown, ShieldCheck, Instagram } from 'lucide-react';
import { BUSINESS_INFO } from '../data';
import heroBg from '../assets/images/hero_background_1781083617747.png';

interface HeroProps {
  onLearnMoreClick: () => void;
}

export default function Hero({ onLearnMoreClick }: HeroProps) {
  return (
    <section
      id="beranda"
      className="relative min-h-screen flex flex-col justify-between bg-zinc-950 text-white overflow-hidden"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Lanskap Pertanian Tani Makmur Bersama"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-105 filter brightness-[0.85] contrast-[1.02]"
        />
        {/* Cinematic Vignettes and Gradients using dark zinc/black instead of brand-dark to avoid washing out the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-transparent" />
      </div>

      {/* Spacer for navigation */}
      <div className="h-20 sm:h-24" />

      {/* Hero Content Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-end pb-12 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          
          {/* Main Headline & Description */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-4"
              id="hero-main-content"
            >
              <div className="inline-flex items-center space-x-2 bg-emerald-600/20 border border-emerald-500/40 px-3.5 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-brand-accent" />
                <span className="text-xs font-heading font-semibold tracking-widest text-[#eeeeee] uppercase">
                  {BUSINESS_INFO.tagline}
                </span>
              </div>
              
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2] text-shadow">
                <span className="text-white block lg:inline-block lg:mr-3 whitespace-nowrap">CV. Tani Makmur Bersama</span>
                <span className="text-brand-accent bg-gradient-to-r from-brand-accent to-[#ebd39e] bg-clip-text text-transparent block lg:inline-block">Bebas Gangguan Hama</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base sm:text-lg lg:text-xl text-gray-300 font-sans tracking-wide leading-relaxed"
              id="hero-subtext"
            >
              {BUSINESS_INFO.headline}
            </motion.p>

            {/* CTA Buttons in hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4 pt-2"
              id="hero-cta-buttons"
            >
              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-3 bg-brand-accent hover:bg-brand-accent/90 text-brand-dark px-7 py-4 rounded-sm text-sm font-heading font-bold tracking-widest transition-all duration-300 shadow-xl shadow-brand-accent/20 hover:scale-[1.02] active:scale-95 uppercase"
              >
                <Phone className="w-4 h-4 fill-current text-brand-dark" />
                <span>Konsultasi WA</span>
              </a>
              <button
                onClick={onLearnMoreClick}
                className="inline-flex items-center space-x-2 bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white transition-all duration-300 px-6 py-4 rounded-sm text-sm font-heading font-medium tracking-widest uppercase"
              >
                <span>Lihat Katalog</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Floating statistics overlayed exactly like the image layout */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-brand-secondary/30" id="stats-section">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-4xl">
            {BUSINESS_INFO.stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.15, duration: 0.6 }}
                className="space-y-1 sm:space-y-2 group"
                id={`hero-stat-card-${idx}`}
              >
                <div className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-brand-accent tracking-tight group-hover:scale-105 transition-transform origin-left duration-300">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs tracking-widest text-gray-400 uppercase font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Shopping Portal & Official Social Media Badges */}
        <div className="mt-8 pt-6 border-t border-brand-secondary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6" id="portal-belanja-row">
          <div className="space-y-1 max-w-md">
            <span className="text-[10px] font-mono font-bold tracking-widest text-brand-accent uppercase block">
              PORTAL BELANJA & SOSMED RESMI
            </span>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Dapatkan produk asli langsung dari distributor resmi lewat platform e-commerce pilihan Anda.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto" id="commerce-buttons-grid">
            <a
              href={BUSINESS_INFO.shopeeUrl1}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-[#EE4D2D] hover:bg-[#d63a1b] text-white px-4 py-2.5 rounded-sm text-xs font-bold font-mono tracking-wider transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              id="hero-shopee1-btn"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>SHOPEE 1</span>
            </a>

            <a
              href={BUSINESS_INFO.shopeeUrl2}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-[#EE4D2D] hover:bg-[#d63a1b] text-white px-4 py-2.5 rounded-sm text-xs font-bold font-mono tracking-wider transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              id="hero-shopee2-btn"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>SHOPEE 2</span>
            </a>

            <a
              href={BUSINESS_INFO.tokopediaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-[#03AC0E] hover:bg-[#028b0b] text-white px-4 py-2.5 rounded-sm text-xs font-bold font-mono tracking-wider transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              id="hero-tokopedia-btn"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>TOKOPEDIA</span>
            </a>

            <a
              href={BUSINESS_INFO.lazadaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-[#0F136E] hover:bg-[#0c1059] text-white px-4 py-2.5 rounded-sm text-xs font-bold font-mono tracking-wider transition-all duration-300 hover:-translate-y-0.5 shadow-sm lg:border lg:border-transparent"
              id="hero-lazada-btn"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-350 bg-white" />
              <span>LAZADA</span>
            </a>

            <a
              href={BUSINESS_INFO.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#833AB4] to-[#E1306C] hover:from-[#72329d] hover:to-[#ca275e] text-white px-4 py-2.5 rounded-sm text-xs font-bold font-mono tracking-wider transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              id="hero-instagram-btn"
            >
              <Instagram className="w-3.5 h-3.5 text-white" />
              <span>INSTAGRAM</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
