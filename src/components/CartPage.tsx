import React, { useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, X, MessageCircle, Lock } from 'lucide-react';
import { useCart } from './CartContext';
import { BUSINESS_INFO, formatRupiah } from '../data';
import { supabase } from '@/lib/supabaseClient';
import { linkProps } from '../router';
import { categoryLabel } from './ProductCard';

const inputClass =
  'w-full border border-line bg-white px-3.5 py-3 text-sm outline-none placeholder:text-muted focus:border-ink';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ name: string; total: number } | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (cartItems.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setError('Mohon lengkapi Nama, No. WhatsApp, dan Alamat Pengiriman.');
      return;
    }

    setIsProcessing(true);
    try {
      let totalAmount = 0;
      const orderItems = [];

      // 1. Cek stok terbaru di Supabase
      for (const item of cartItems) {
        const { data: product, error: prodError } = await supabase
          .from('products')
          .select('id, name, price, stok')
          .eq('id', item.product.id)
          .single();

        if (prodError || !product) throw new Error(`Produk "${item.product.name}" tidak ditemukan.`);
        if (product.stok < item.quantity) {
          throw new Error(`Stok "${product.name}" tidak cukup. Tersisa: ${product.stok}`);
        }

        totalAmount += product.price * item.quantity;
        orderItems.push({ product_id: product.id, name: product.name, price: product.price, quantity: item.quantity });
      }

      // 2. Simpan pesanan tamu (tanpa login)
      const { error: orderError } = await supabase.from('orders').insert([
        {
          customer_name: customerName,
          customer_email: customerEmail || 'guest@email.com',
          customer_phone: customerPhone,
          customer_address: shippingAddress,
          items: orderItems,
          total_price: totalAmount,
          status: 'pending',
          notes: notes || 'Order dari Website (Guest)',
        },
      ]);
      if (orderError) throw orderError;

      // 3. Kurangi stok
      for (const item of orderItems) {
        const { data: currentProduct } = await supabase.from('products').select('stok').eq('id', item.product_id).single();
        if (currentProduct) {
          await supabase.from('products').update({ stok: currentProduct.stok - item.quantity }).eq('id', item.product_id);
        }
      }

      setSuccess({ name: customerName, total: totalAmount });
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Gagal membuat pesanan: ' + (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    const waText = `Halo Tani Makmur Bersama, saya ${success.name} baru saja membuat pesanan di website dengan total ${formatRupiah(success.total)}. Mohon konfirmasinya.`;
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-brand" strokeWidth={1.5} />
        <h1 className="mt-4 font-heading text-3xl font-black uppercase">Pesanan Diterima</h1>
        <p className="mt-2 text-sm text-muted">
          Terima kasih, {success.name}. Tim kami akan segera menghubungi Anda via WhatsApp untuk konfirmasi ongkos kirim dan pembayaran.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <a
            href={`${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-brand py-4 text-xs font-bold uppercase tracking-widest text-white"
          >
            <MessageCircle className="h-4 w-4" /> Konfirmasi via WhatsApp
          </a>
          <a {...linkProps('/produk')} className="border border-ink py-4 text-xs font-bold uppercase tracking-widest">
            Lanjut Belanja
          </a>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-line" strokeWidth={1.25} />
        <h1 className="mt-4 font-heading text-3xl font-black uppercase">Keranjang Kosong</h1>
        <p className="mt-2 text-sm text-muted">Belum ada produk di keranjang Anda.</p>
        <a {...linkProps('/produk')} className="mt-8 inline-block bg-ink px-10 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand">
          Mulai Belanja
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 flex items-end justify-between border-b border-line pb-5">
        <div>
          <h1 className="font-heading text-3xl font-black uppercase sm:text-4xl">Keranjang</h1>
          <p className="mt-1 text-sm text-muted">{cartCount} barang</p>
        </div>
        <button onClick={clearCart} className="text-xs font-semibold text-muted underline hover:text-sale">
          Kosongkan
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Daftar barang */}
        <ul className="divide-y divide-line">
          {cartItems.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-4 py-5 first:pt-0">
              <a {...linkProps(`/produk/${product.id}`)} className="h-24 w-24 shrink-0 bg-soft sm:h-28 sm:w-28">
                <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
              </a>
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-muted">{categoryLabel(product.category)}</p>
                    <a {...linkProps(`/produk/${product.id}`)} className="line-clamp-2 text-sm font-semibold hover:underline">
                      {product.name}
                    </a>
                    <p className="mt-1 text-sm text-muted">{formatRupiah(product.price)}</p>
                  </div>
                  <button onClick={() => removeFromCart(product.id)} className="h-fit p-1 text-muted hover:text-sale" aria-label="Hapus">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex h-9 items-center border border-line">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="flex h-full w-9 items-center justify-center" aria-label="Kurangi">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={product.stok > 0 && quantity >= product.stok}
                      className="flex h-full w-9 items-center justify-center disabled:opacity-30"
                      aria-label="Tambah"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-heading text-base font-extrabold">{formatRupiah(product.price * quantity)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Ringkasan & data pengiriman */}
        <form onSubmit={handleCheckout} className="h-fit space-y-6 bg-soft p-6 lg:sticky lg:top-32">
          <div>
            <h2 className="mb-4 font-heading text-lg font-black uppercase">Data Pengiriman</h2>
            <div className="space-y-3">
              <input className={inputClass} placeholder="Nama lengkap *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
              <input className={inputClass} type="tel" placeholder="No. WhatsApp * (08xxxxxxxxxx)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
              <input className={inputClass} type="email" placeholder="Email (opsional)" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
              <textarea
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Alamat lengkap * (jalan, kelurahan, kecamatan, kota, kode pos)"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
              <textarea className={`${inputClass} resize-none`} rows={2} placeholder="Catatan (opsional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal ({cartCount} barang)</span>
              <span className="font-semibold">{formatRupiah(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Ongkos kirim</span>
              <span className="text-muted">Dikonfirmasi via WA</span>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <span className="font-bold uppercase">Total</span>
              <span className="font-heading text-xl font-black">{formatRupiah(cartTotal)}</span>
            </div>
          </div>

          {error && <p className="border border-sale/30 bg-white p-3 text-sm text-sale">{error}</p>}

          <button
            type="submit"
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 bg-ink py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            {isProcessing ? 'Memproses…' : 'Buat Pesanan'}
          </button>
          <p className="text-center text-xs text-muted">Tanpa perlu daftar akun. Pembayaran dikonfirmasi setelah pesanan dibuat.</p>
        </form>
      </div>
    </div>
  );
}
