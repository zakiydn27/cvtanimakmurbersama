import React, { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, CheckCircle2, ShoppingBag, ExternalLink, MessageSquare } from 'lucide-react';
import { BUSINESS_INFO } from '../data';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    product: 'Konsultasi Hama Umum',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  const productsList = [
    'Konsultasi Hama Umum',
    'Insektisida LASNIU 25 EC',
    'Pest Control Amarilis 50 EC',
    'Termitisida Basmi Rayap',
    'Rodentisida Racun Tikus',
    'Trap Tikus Trigonal',
    'Mini Fogging Portable'
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Silakan lengkapi nama dan nomor handphone Anda.");
      return;
    }

    setIsSubmitting(true);
    
    // Create WhatsApp encoded string
    const waText = `Halo Tani Makmur Bersama,\n\nNama saya *${formData.name}*\nNomor HP: *${formData.phone}*\nKetertarikan Produk: *${formData.product}*\n\nPesan:\n"${formData.message || 'Saya ingin bertanya lebih lanjut seputar produk ini.'}"`;
    const waEncoded = `https://wa.me/628155071697?text=${encodeURIComponent(waText)}`;
    
    setRedirectUrl(waEncoded);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      product: 'Konsultasi Hama Umum',
      message: ''
    });
    setIsSuccess(false);
  };

  return (
    <section id="kontak" className="py-24 sm:py-32 bg-brand-dark border-t border-brand-secondary/10 relative">
      <div className="absolute inset-x-0 bottom-0 h-96 bg-[linear-gradient(to_top,rgba(22,101,52,0.03),transparent)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16">
          
          {/* Left Side: Business & Store Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold tracking-widest text-brand-accent uppercase block" id="contact-label">
                HUBUNGI KAMI SEKARANG
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight" id="contact-title">
                Mulai Pembicaraan dengan Formulator Kami
              </h2>
              <div className="h-1.5 w-16 bg-brand-accent rounded-full" />
              <p className="text-slate-600 font-sans leading-relaxed text-sm">
                Hubungi kami untuk mendapatkan harga grosir pengadaan besar, penawaran reseller toko tani, atau menanyakan kecocokan zat kimia termitisida terhadap struktur kayu bangunan Anda.
              </p>
            </div>

            {/* Direct Information Slots */}
            <div className="space-y-5" id="contact-details-slots">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary border border-brand-secondary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-brand-accent" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">WhatsApp Layanan Handal</span>
                  <a href={BUSINESS_INFO.whatsappUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-800 hover:text-brand-accent transition-colors">
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary border border-brand-secondary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-brand-accent" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Alamat Surat Elektronik</span>
                  <a href={`mailto:${BUSINESS_INFO.email}`} className="text-sm font-bold text-slate-800 hover:text-brand-accent transition-colors">
                    {BUSINESS_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary border border-brand-secondary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-brand-accent" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Kantor & Distribusi Logistik</span>
                  <span className="text-sm font-bold text-slate-800 block">
                    {BUSINESS_INFO.address}
                  </span>
                  <span className="text-xs text-slate-600">
                    Pengiriman terintegrasi ke 34 Provinsi Seluruh Indonesia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div 
              className="bg-white border border-brand-secondary/10 rounded-2xl p-6 sm:p-8 shadow-md relative"
              id="contact-form-widget"
            >
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name input */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                        NAMA LENGKAP *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-50 border border-brand-secondary/10 focus:border-brand-accent rounded p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors"
                      />
                    </div>
                    {/* Phone input */}
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                        NOMOR HANDPHONE (WA) *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        placeholder="Contoh: 081234567890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-brand-secondary/10 focus:border-brand-accent rounded p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Product selector dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="product" className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                      TOPIK ATAU PRODUK YANG DITANYAKAN
                    </label>
                    <select
                      id="product"
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full bg-slate-50 border border-brand-secondary/10 focus:border-brand-accent rounded p-3 text-sm text-slate-800 focus:outline-none focus:bg-white transition-colors cursor-pointer"
                    >
                      {productsList.map((prod) => (
                        <option key={prod} value={prod} className="bg-white text-slate-800">
                          {prod}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message input */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
                      PESAN ATAU PERTANYAAN TAMBAHAN
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Tuliskan keluhan hama atau pertanyaan pengiriman grosir..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-50 border border-brand-secondary/10 focus:border-brand-accent rounded p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors resize-none"
                    />
                  </div>

                  {/* Submit button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center space-x-2 bg-brand-accent hover:bg-brand-accent/90 disabled:bg-brand-accent/50 text-white font-heading font-black tracking-widest text-xs py-4 rounded-sm transition-all uppercase shadow-md active:scale-95"
                      id="btn-submit-form"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />
                          <span>MENGIRIMKAN DATA...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>KIRIM PESAN KONSULTASI</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Success Feedack Frame */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-6"
                  id="success-form-message"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-heading font-extrabold text-[#eeeeee]">
                      Pesan Formulir Berhasil Disiapkan!
                    </h3>
                    <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                      Kami telah memvalidasi keluhan Anda. Silakan klik tombol di bawah untuk menyalurkan pesan langsung ke admin WhatsApp resmi kami untuk respon instan (kurang dari 5 menit).
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <a
                      href={redirectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-2 bg-brand-accent hover:bg-brand-accent/90 text-brand-dark font-heading font-black tracking-widest text-xs px-6 py-3.5 rounded-sm uppercase shadow-lg"
                      id="btn-redirect-wa"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>KIRIM VIA WA SEKARANG</span>
                    </a>
                    <button
                      onClick={handleReset}
                      className="text-xs font-semibold text-gray-400 hover:text-white transition-colors bg-brand-dark/40 px-5 py-3.5 rounded-sm border border-brand-secondary/30"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
