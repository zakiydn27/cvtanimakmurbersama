import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../data';
import { supabase } from '@/lib/supabaseClient'; // ✅ TAMBAHKAN INI

interface LoginPageProps {
  onBack: () => void;
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
}

export default function LoginPage({ onBack, onNavigateToRegister, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // ✅ GUNAKAN SUPABASE AUTH (Bukan fetch ke localhost)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        // Supabase akan memberikan pesan error yang jelas (misal: "Invalid login credentials")
        console.error('Login error:', error);
        alert(error.message);
      } else {
        // ✅ Login berhasil! 
        // Tidak perlu localStorage.setItem, Supabase sudah menghandle session secara aman.
        // App.tsx akan mendeteksi perubahan ini via onAuthStateChange.
        alert('Login berhasil! Selamat datang kembali.');
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Login exception:', error);
      alert('Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-brand-dark relative flex items-center justify-center p-4"
      id="login-page"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(22,101,52,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(234,88,12,0.05),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-heading font-bold tracking-widest text-slate-400 hover:text-brand-accent transition-colors mb-6 group"
          id="btn-back-to-home"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>KEMBALI KE BERANDA</span>
        </button>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-brand-secondary p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/20 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-accent/10 rounded-full -ml-12 -mb-12" />
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-heading font-extrabold tracking-wide uppercase">
                    LOGIN
                  </h1>
                  <p className="text-xs text-white/80 font-sans">
                    Masuk ke akun Tani Makmur Bersama
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 block tracking-wider uppercase">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@email.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-accent rounded-lg pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 block tracking-wider uppercase">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-accent rounded-lg pl-10 pr-10 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-brand-accent focus:ring-brand-accent" />
                <span>Ingat saya</span>
              </label>
              <button type="button" className="text-brand-accent font-bold hover:underline">
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-accent hover:bg-brand-accent/90 disabled:bg-brand-accent/50 text-white font-heading font-extrabold tracking-widest text-sm py-3.5 rounded-lg uppercase shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>MASUK</span>
                </>
              )}
            </button>

            <div className="pt-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-600">
                Belum punya akun?
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="ml-1 text-brand-accent font-bold hover:underline"
                >
                  Daftar di sini
                </button>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-center space-x-2 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
            <span>Dilindungi oleh sistem keamanan Tani Makmur Bersama</span>
          </div>
        </motion.div>

        {/* Brand Footer */}
        <div className="text-center mt-6">
          <p className="text-[10px] text-slate-500 font-mono tracking-wider">
            © 2026 {BUSINESS_INFO.name} - {BUSINESS_INFO.tagline}
          </p>
        </div>
      </div>
    </motion.div>
  );
}