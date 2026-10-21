import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Headphones, MapPin, TrendingDown, ClipboardList, Sparkles, ShoppingBag, CheckCircle } from 'lucide-react';
import { ADVANTAGES } from '../data';

const renderIcon = (name: string, className: string = "w-6 h-6 text-brand-accent") => {
  switch (name) {
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'Headphones': return <Headphones className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    case 'TrendingDown': return <TrendingDown className={className} />;
    case 'ClipboardList': return <ClipboardList className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    default: return <CheckCircle className={className} />;
  }
};

export function AdvantagesSection() {
  return (
    <section id="keunggulan" className="py-24 sm:py-32 bg-brand-dark relative flex-1 flex flex-col justify-center min-h-[calc(100vh-160px)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,90,39,0.04),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        <div className="flex flex-col items-center space-y-16">
          
          {/* Centered text highlights */}
          <div className="max-w-3xl w-full text-center space-y-6 flex flex-col items-center">
            <motion.span 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.2] text-brand-accent bg-gradient-to-r from-brand-accent to-amber-500 bg-clip-text text-transparent block" 
              id="advantages-label"
            >
              MENGAPA MEMILIH KAMI?
            </motion.span>
            <h2 className="text-4xl sm:text-5xl font-heading font-bold text-slate-900 tracking-tight lettercase text-center sm:whitespace-nowrap whitespace-normal" id="advantages-title">
              Keunggulan Utama Tani Makmur Bersama
            </h2>
            <div className="h-1.5 w-20 bg-brand-accent rounded-full mx-auto" />
            <p className="text-slate-600 font-sans leading-relaxed text-sm sm:text-base text-center">
              Kami memahami bahwa setiap komoditas sawah maupun tata letak hotel memiliki kompleksitas serbuan hama yang berbeda-beda. Standardisasi mutu produk terdaftar serta jalur grosir tangan pertama menjadi pilar kepercayaan kami menopang produktivitas Indonesia.
            </p>
            
            <div className="p-4 rounded-lg bg-brand-primary border border-brand-secondary/10 max-w-md mx-auto text-center shadow-sm">
              <span className="text-xs font-bold text-brand-accent block mb-1">
                Melayani Indonesia Timur & Barat
              </span>
              <span className="text-xs text-slate-700">
                Dukungan ekspedisi laut, udara, kargo darat untuk pengadaan berskala kecil maupun tonase besar.
              </span>
            </div>
          </div>

          {/* Right side advantages 2x2 grid (centered under header) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="advantages-grid">
            {ADVANTAGES.map((adv, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                key={adv.id}
                className="bg-white border border-brand-secondary/10 hover:border-brand-accent rounded-xl p-6 space-y-4 hover:shadow-md transition-all duration-300 shadow-sm flex flex-col items-center text-center"
                id={`advantage-item-${adv.id}`}
              >
                <div className="w-12 h-12 rounded-lg bg-brand-primary flex items-center justify-center border border-brand-secondary/10 shadow-inner mx-auto">
                  {renderIcon(adv.iconName, "w-6 h-6 text-brand-accent")}
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="font-heading font-extrabold text-slate-800 text-sm tracking-wide">
                    {adv.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {adv.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

export default function CompanyValue() {
  return (
    <>
      <AdvantagesSection />
    </>
  );
}
