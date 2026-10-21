import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Lock, Save, Trash2, ArrowLeft, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { BUSINESS_INFO } from '../data';

interface ProfilePageProps {
  onBack: () => void;
  onLogout: () => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  registeredAt: string;
}

export default function ProfilePage({ onBack, onLogout }: ProfilePageProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert('Silakan login terlebih dahulu');
        onBack();
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      alert('Gagal memuat data profil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('Password dan konfirmasi password tidak cocok!');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      alert('Password minimal 8 karakter!');
      return;
    }

    setIsSaving(true);
    
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) throw new Error('User tidak ditemukan');
      
      const userData = JSON.parse(storedUser);

      const response = await fetch(`http://localhost:3000/api/users/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          newPassword: formData.newPassword || undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Profil berhasil diupdate!');
        // Update localStorage dengan data baru
        localStorage.setItem('user', JSON.stringify(data.data));
        setUser(data.data);
        // Reset password fields
        setFormData({
          ...formData,
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        alert(data.error || 'Gagal update profil');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Terjadi kesalahan. Pastikan server backend berjalan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) throw new Error('User tidak ditemukan');
      
      const userData = JSON.parse(storedUser);

      const response = await fetch(`http://localhost:3000/api/users/${userData.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Akun berhasil dihapus');
        localStorage.removeItem('user');
        onLogout();
      } else {
        alert(data.error || 'Gagal menghapus akun');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Terjadi kesalahan saat menghapus akun');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-brand-accent transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>KEMBALI</span>
        </button>

        {/* Header */}
        <div className="bg-[#1e5631] rounded-t-2xl p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wide uppercase">PROFIL SAYA</h1>
              <p className="text-sm text-white/90 mt-1">Kelola informasi akun Anda</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="bg-white rounded-b-2xl shadow-2xl p-8 space-y-6">
          {/* Info Registrasi */}
          <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Bergabung Sejak
            </p>
            <p className="text-sm text-slate-800 font-medium">
              {user?.registeredAt ? new Date(user.registeredAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '-'}
            </p>
          </div>

          {/* Nama Lengkap */}
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

          {/* Email & Telepon */}
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
                Nomor Telepon <span className="text-red-500">*</span>
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

          {/* Alamat */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
              Alamat Lengkap
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap Anda (opsional)"
                rows={3}
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-brand-accent rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium resize-none"
              />
            </div>
          </div>

          {/* Ubah Password */}
          <div className="pt-6 border-t-2 border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
              <Lock className="w-5 h-5 text-brand-accent" />
              <span>Ubah Password</span>
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                  Password Baru
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Kosongkan jika tidak ingin mengubah"
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

              {formData.newPassword && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Ulangi password baru"
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
              )}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-[#1e5631] hover:bg-[#164226] disabled:bg-slate-300 text-white font-bold tracking-widest text-sm py-4 rounded-xl uppercase shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            {isSaving ? (
              <span>Menyimpan...</span>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>SIMPAN PERUBAHAN</span>
              </>
            )}
          </button>

          {/* Delete Account Button */}
          <div className="pt-6 border-t-2 border-slate-200">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-start space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">
                    Zona Bahaya
                  </h3>
                  <p className="text-xs text-red-600 mt-1">
                    Tindakan ini tidak dapat dibatalkan. Semua data akun Anda akan dihapus secara permanen.
                  </p>
                </div>
              </div>

              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest text-sm py-3.5 rounded-xl uppercase transition-all flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>HAPUS AKUN</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-red-800 text-center">
                    Yakin ingin menghapus akun?
                  </p>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold tracking-widest text-sm py-3.5 rounded-xl uppercase transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest text-sm py-3.5 rounded-xl uppercase transition-all flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Ya, Hapus</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500 font-medium tracking-wider">
            © 2026 {BUSINESS_INFO.name} - {BUSINESS_INFO.tagline}
          </p>
        </div>
      </div>
    </motion.div>
  );
}