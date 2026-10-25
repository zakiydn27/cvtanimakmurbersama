import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CheckCircle2, MapPin, User, Phone, Mail } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { BUSINESS_INFO } from '../data';
import { supabase } from '@/lib/supabaseClient';

// ✅ HAPUS onNavigateToLogin dari interface
interface CartPageProps {
  onBack: () => void;
}

export default function CartPage({ onBack }: CartPageProps) {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();
  
  // ✅ State baru untuk informasi pelanggan & pengiriman (Guest Checkout)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }

    // ✅ Validasi form wajib diisi
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      alert('Mohon lengkapi Nama Penerima, No. HP, dan Alamat Pengiriman.');
      return;
    }

    setIsProcessing(true);
    
    try {
      let totalAmount = 0;
      const orderItems = [];

      // 1. Validasi stok real-time dari Supabase
      for (const item of cartItems) {
        const { data: product, error: prodError } = await supabase
          .from('products')
          .select('id, name, price, stok')
          .eq('id', item.product.id)
          .single();

        if (prodError || !product) {
          throw new Error(`Produk "${item.product.name}" tidak ditemukan.`);
        }

        if (product.stok < item.quantity) {
          throw new Error(`Stok "${product.name}" tidak cukup! Tersisa: ${product.stok}`);
        }

        totalAmount += product.price * item.quantity;
        orderItems.push({
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        });
      }

      // 2. Simpan Order sebagai "Guest Order" (tanpa user_id)
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: customerName, // ✅ Ambil dari state form
          customer_email: customerEmail || 'guest@email.com',
          customer_phone: customerPhone,
          customer_address: shippingAddress,
          items: orderItems,
          total_price: totalAmount,
          status: 'pending',
          notes: notes || 'Order dari Website (Guest)'
        }]);

      if (orderError) throw orderError;

      // 3. Kurangi stok produk di database
      for (const item of orderItems) {
        const { data: currentProduct } = await supabase
          .from('products')
          .select('stok')
          .eq('id', item.product_id)
          .single();
        
        if (currentProduct) {
          await supabase
            .from('products')
            .update({ stok: currentProduct.stok - item.quantity })
            .eq('id', item.product_id);
        }
      }

      // 4. Sukses
      alert('✅ Pesanan berhasil dibuat! Kami akan segera menghubungi Anda.');
      clearCart();
      onBack(); // Kembali ke beranda
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('❌ Gagal membuat pesanan: ' + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-brand-accent transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>KEMBALI</span>
          </button>

          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Keranjang Kosong</h2>
            <p className="text-slate-600 mb-6">Belum ada produk di keranjang Anda</p>
            <button
              onClick={onBack}
              className="bg-[#1e5631] hover:bg-[#164226] text-white font-bold tracking-widest text-sm py-3.5 px-8 rounded-xl uppercase transition-all"
            >
              MULAI BELANJA
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-brand-accent transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>KEMBALI</span>
        </button>

        <div className="bg-[#1e5631] rounded-t-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-wide uppercase">KERANJANG BELANJA</h1>
                <p className="text-sm text-white/90 mt-1">{cartCount} produk di keranjang</p>
              </div>
            </div>
            <button
              onClick={clearCart}
              className="text-xs font-bold text-white/80 hover:text-white underline"
            >
              Hapus Semua
            </button>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-2xl p-8">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-brand-accent/50 transition-all"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg bg-white border border-slate-200"
                />

                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{item.product.category}</p>
                  <p className="text-sm font-bold text-brand-accent mt-2">
                    Rp {item.product.price.toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 bg-white border-2 border-slate-200 hover:border-brand-accent rounded-lg flex items-center justify-center text-slate-600 hover:text-brand-accent transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 bg-white border-2 border-slate-200 hover:border-brand-accent rounded-lg flex items-center justify-center text-slate-600 hover:text-brand-accent transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-xs text-slate-500 mb-1">Subtotal</p>
                  <p className="text-sm font-bold text-slate-800">
                    Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* ✅ FORM INFORMASI PELANGGAN & PENGIRIMAN (GUEST CHECKOUT) */}
          <div className="mt-8 pt-6 border-t-2 border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <User className="w-5 h-5 text-brand-accent" />
              <span>Data Penerima</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama penerima pesanan"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-brand-accent rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                  No. WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-brand-accent rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                Alamat Pengiriman Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Nama jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
                  rows={3}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-brand-accent rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium resize-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block tracking-wide uppercase">
                Catatan Pesanan (Opsional)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 hidden" /> {/* Spacer */}
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Titip di pos depan, hubungi sebelum kirim, dll."
                  rows={2}
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-brand-accent rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-accent/10 transition-all font-medium resize-none"
                />
              </div>
            </div>
          </div>

          {/* Total & Checkout */}
          <div className="mt-8 pt-6 border-t-2 border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-bold text-slate-800">Total Belanja:</span>
              <span className="text-2xl font-bold text-brand-accent">
                Rp {cartTotal.toLocaleString('id-ID')}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-[#1e5631] hover:bg-[#164226] disabled:bg-slate-300 text-white font-bold tracking-widest text-sm py-4 rounded-xl uppercase shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <span>Memproses Pesanan...</span>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>LANJUTKAN KE CHECKOUT</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Pesanan aman & data terlindungi</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-slate-500 font-medium tracking-wider">
            © 2026 {BUSINESS_INFO.name} - {BUSINESS_INFO.tagline}
          </p>
        </div>
      </div>
    </motion.div>
  );
}