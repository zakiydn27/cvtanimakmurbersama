import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User, Phone, ArrowLeft, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '../data';

interface RegisterPageProps {
  onBack: () => void;
  onNavigateToLogin: () => void;
}

export default function RegisterPage({ onBack, onNavigateToLogin }: RegisterPageProps) {
  // Benefits list for left panel. Try to use BUSINESS_INFO.benefits if available.
  const benefits: string[] = Array.isArray((BUSINESS_INFO as any)?.benefits)
    ? (BUSINESS_INFO as any).benefits
    : [
        'Akses ke produk dan layanan terbaik',
        'Dukungan teknis dan saran ahli',
        'Promo dan penawaran eksklusif untuk anggota',
      ];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok!');
      return;
    }

    if (!agreeTerms) {
      alert('Anda harus menyetujui syarat dan ketentuan');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registrasi berhasil
        alert(data.message);
        // Redirect ke halaman login
        onNavigateToLogin();
      } else {
        // Registrasi gagal
        alert(data.error);
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('Terjadi kesalahan. Pastikan server backend berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative py-12 px-4"
      id="register-page"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-brand-accent transition-colors mb-8 group"
          id="btn-back-to-home"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>KEMBALI KE BERANDA</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel: Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 text-slate-800 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-brand-accent/10 p-3 rounded-xl">
                  <UserPlus className="w-8 h-8 text-brand-accent" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-wide">
                  DAFTAR AKUN
                </h2>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Bergabung dengan ribuan petani dan profesional pest control yang telah mempercayai Tani Makmur Bersama sebagai mitra pengendalian hama terpercaya.
              </p>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-brand-accent tracking-wider uppercase mb-3">
                  Keuntungan Bergabung:
                </h3>
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-600 tracking-wider uppercase mb-3">
                  SUDAH PUNYA AKUN?
                </p>
                <button
                  onClick={onNavigateToLogin}
                  className="bg-rounded solid bg-brand-accent hover:bg-brand-accent/90 text-white font-bold tracking-widest text-sm py-3 rounded-xl uppercase shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 w-full"
                >
                  LOGIN DI SINI
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Panel: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
              {/* Form Header */}
              <div className="bg-[#166534] p-8 text-white">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-wide uppercase mb-1">
                      BUAT AKUN BARU
                    </h1>
                    <p className="text-sm text-white/90 font-medium">
                      Lengkapi data di bawah ini untuk memulai
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap Anda"
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-brand-accent rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contoh@email.com"
                        className="w-full bg-slate-50 border-2 border-slate-200 focus:border-brand-accent rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                      No. Telepon <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="081234567890"
                        className="w-full bg-slate-50 border-2 border-slate-200 focus:border-brand-accent rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimal 8 karakter"
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-brand-accent rounded-xl pl-12 pr-12 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Ulangi password Anda"
                      className="w-full bg-slate-50 border-2 border-slate-200 focus:border-brand-accent rounded-xl pl-12 pr-12 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-start space-x-3 text-sm text-slate-700 cursor-pointer p-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-brand-accent/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-accent focus:ring-brand-accent focus:ring-2"
                  />
                  <span className="font-medium">
                    Saya menyetujui <span className="text-brand-accent font-bold hover:underline">Syarat & Ketentuan</span> serta <span className="text-brand-accent font-bold hover:underline">Kebijakan Privasi</span> Tani Makmur Bersama
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-rounded solid bg-brand-accent hover:bg-brand-accent/90 text-white font-bold tracking-widest text-sm py-3 rounded-xl uppercase shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span>Memproses...</span>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>DAFTAR SEKARANG</span>
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="bg-slate-50 p-5 border-t border-slate-200 flex items-center justify-center space-x-2 text-xs text-slate-600 font-medium">
                <ShieldCheck className="w-4 h-4 text-brand-accent" />
                <span>Data Anda dilindungi dengan enkripsi SSL 256-bit</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Brand Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500 font-medium tracking-wider">
            © 2026 {BUSINESS_INFO.name} - {BUSINESS_INFO.tagline}
          </p>
        </div>
      </div>
    </motion.div>
  );
}