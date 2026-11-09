import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Minus, Plus, ShieldCheck, ShoppingBag, Truck, MessageCircle, Award, Check } from 'lucide-react';
import { BUSINESS_INFO, formatRupiah } from '../data';
import { useProducts } from '../hooks/useProducts';
import { categoryPath, linkProps, navigate } from '../router';
import { useCart } from './CartContext';
import ProductCard, { categoryLabel } from './ProductCard';

/**
 * Deskripsi di database memakai format sederhana:
 * **Judul Bagian** diikuti baris teks, "✓ poin", "• poin", atau "1. langkah".
 */
function StructuredDescription({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  const blocks: React.ReactNode[] = [];

  const renderLines = (content: string, keyBase: string) =>
    content.split('\n').map((raw, idx) => {
      const line = raw.trim();
      if (!line) return null;
      if (/^[✓•\-]\s*/.test(line) && !/^\d/.test(line)) {
        return (
          <li key={`${keyBase}-${idx}`} className="flex gap-3 py-1">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>{line.replace(/^[✓•\-]\s*/, '')}</span>
          </li>
        );
      }
      const num = line.match(/^(\d+)\.\s*(.*)$/);
      if (num) {
        return (
          <li key={`${keyBase}-${idx}`} className="flex gap-3 py-1">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-ink text-[10px] font-bold text-white">{num[1]}</span>
            <span>{num[2]}</span>
          </li>
        );
      }
      return <p key={`${keyBase}-${idx}`} className="py-1">{line}</p>;
    });

  parts.forEach((part, i) => {
    const trimmed = part.trim();
    if (!trimmed) return;
    if (i % 2 === 1) {
      blocks.push(
        <h3 key={`h-${i}`} className="mb-2 mt-8 font-heading text-sm font-black uppercase tracking-wider first:mt-0">
          {trimmed}
        </h3>
      );
    } else {
      blocks.push(<ul key={`c-${i}`} className="space-y-0.5">{renderLines(trimmed, `c-${i}`)}</ul>);
    }
  });

  return <div className="text-sm leading-relaxed text-ink/80">{blocks}</div>;
}

const TABS = ['Deskripsi', 'Spesifikasi', 'Pengiriman'] as const;

export default function ProductDetailPage({ id }: { id: string }) {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Deskripsi');

  const product = useMemo(() => products.find((p) => String(p.id) === id), [products, id]);
  const related = useMemo(
    () => (product ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4) : []),
    [products, product]
  );

  useEffect(() => {
    setQty(1);
    setTab('Deskripsi');
  }, [id]);

  useEffect(() => {
    if (product) document.title = `${product.name} | Tani Makmur Bersama`;
    return () => {
      document.title = 'CV. Tani Makmur Bersama';
    };
  }, [product]);

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl animate-pulse gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="aspect-square bg-soft" />
        <div className="space-y-4">
          <div className="h-4 w-1/4 bg-soft" />
          <div className="h-10 w-3/4 bg-soft" />
          <div className="h-8 w-1/3 bg-soft" />
          <div className="h-32 bg-soft" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-heading text-3xl font-black uppercase">Produk tidak ditemukan</h1>
        <p className="mt-2 text-sm text-muted">Produk mungkin sudah tidak tersedia.</p>
        <a {...linkProps('/produk')} className="mt-6 inline-block bg-ink px-8 py-4 text-xs font-bold uppercase tracking-widest text-white">
          Kembali ke Katalog
        </a>
      </div>
    );
  }

  const stok = product.stok ?? 0;
  const soldOut = stok <= 0;
  const maxQty = Math.max(1, stok);

  const waText = `Halo Tani Makmur Bersama, saya ingin memesan:\n\n*${product.name}*\nJumlah: ${qty}\nHarga satuan: ${formatRupiah(product.price)}\nTotal: ${formatRupiah(product.price * qty)}\n\nMohon info ketersediaan dan ongkos kirimnya. Terima kasih.`;
  const waUrl = `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(waText)}`;

  const specs = [
    ['Kategori', product.category],
    ['Target hama', product.pestTarget],
    ['Formulasi', product.formulation],
    ['Kemasan', product.packaging],
    ['Stok', soldOut ? 'Habis' : `${stok} pcs`],
    ['Status', 'Terdaftar resmi'],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <div>
      <nav className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-hidden px-4 py-4 text-xs text-muted sm:px-6 lg:px-8">
        <a {...linkProps('/')} className="shrink-0 hover:text-ink">Beranda</a>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <a {...linkProps(categoryPath(product.category))} className="shrink-0 hover:text-ink">{categoryLabel(product.category)}</a>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        {/* Gambar */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="relative aspect-square overflow-hidden bg-soft">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className={`h-full w-full object-contain p-6 ${soldOut ? 'opacity-60 grayscale' : ''}`}
            />
            {soldOut && (
              <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">Stok Habis</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <a {...linkProps(categoryPath(product.category))} className="text-xs font-bold uppercase tracking-[0.2em] text-accent hover:underline">
            {categoryLabel(product.category)}
          </a>
          <h1 className="mt-2 font-heading text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 font-heading text-3xl font-extrabold">{formatRupiah(product.price)}</p>
          <p className={`mt-2 text-sm font-semibold ${soldOut ? 'text-sale' : stok <= 10 ? 'text-accent' : 'text-brand'}`}>
            {soldOut ? 'Stok habis — hubungi kami untuk pre-order' : stok <= 10 ? `Stok terbatas, tersisa ${stok}` : 'Stok tersedia'}
          </p>

          {(product.features?.length ?? 0) > 0 && (
            <ul className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
              {product.features.slice(0, 5).map((f, i) => (
                <li key={i} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Jumlah & tombol beli */}
          <div className="mt-6 border-t border-line pt-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest">Jumlah</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex h-14 w-full items-center border border-ink sm:w-36">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={soldOut || qty <= 1}
                  className="flex h-full w-12 items-center justify-center disabled:opacity-30"
                  aria-label="Kurangi"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex-1 text-center text-sm font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  disabled={soldOut || qty >= maxQty}
                  className="flex h-full w-12 items-center justify-center disabled:opacity-30"
                  aria-label="Tambah"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, qty)}
                disabled={soldOut}
                className="flex h-14 flex-1 items-center justify-center gap-2 bg-ink text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
              >
                <ShoppingBag className="h-4 w-4" />
                {soldOut ? 'Stok Habis' : 'Tambah ke Keranjang'}
              </button>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex h-14 items-center justify-center gap-2 border border-brand text-xs font-bold uppercase tracking-widest text-brand transition-colors hover:bg-brand hover:text-white"
            >
              <MessageCircle className="h-4 w-4" />
              {soldOut ? 'Tanya Ketersediaan via WhatsApp' : 'Pesan Langsung via WhatsApp'}
            </a>
            {!soldOut && (
              <button
                onClick={() => {
                  addToCart(product, qty);
                  navigate('/cart');
                }}
                className="mt-3 w-full text-center text-xs font-semibold text-muted underline hover:text-ink"
              >
                Beli sekarang & lanjut ke checkout
              </button>
            )}
          </div>

          {/* Jaminan */}
          <div className="mt-6 grid grid-cols-3 gap-2 bg-soft p-4 text-center">
            {[
              [Award, '100% Asli'],
              [ShieldCheck, 'Terdaftar Resmi'],
              [Truck, 'Kirim Nasional'],
            ].map(([Icon, label]: any) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <Icon className="h-5 w-5 text-brand" strokeWidth={1.5} />
                <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>

          {/* Tab informasi */}
          <div className="mt-10">
            <div className="flex gap-6 border-b border-line">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`-mb-px border-b-2 pb-3 text-xs font-bold uppercase tracking-widest ${
                    tab === t ? 'border-ink' : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="py-6">
              {tab === 'Deskripsi' && <StructuredDescription text={product.description} />}
              {tab === 'Spesifikasi' && (
                <dl className="divide-y divide-line text-sm">
                  {specs.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-3 gap-4 py-3">
                      <dt className="text-muted">{k}</dt>
                      <dd className="col-span-2 font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {tab === 'Pengiriman' && (
                <div className="space-y-3 text-sm leading-relaxed text-ink/80">
                  <p>Kami melayani pengiriman ke seluruh Indonesia melalui ekspedisi darat, laut, dan udara, untuk pembelian satuan maupun partai besar.</p>
                  <p>Ongkos kirim dihitung berdasarkan berat dan kota tujuan. Setelah pesanan dibuat, tim kami akan menghubungi Anda via WhatsApp untuk konfirmasi total dan pembayaran.</p>
                  <p>Jam operasional: {BUSINESS_INFO.hours}.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-heading text-2xl font-black uppercase sm:text-3xl">Produk Serupa</h2>
              <a {...linkProps(categoryPath(product.category))} className="border-b-2 border-ink pb-0.5 text-xs font-bold uppercase tracking-widest">
                Lihat Semua
              </a>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
