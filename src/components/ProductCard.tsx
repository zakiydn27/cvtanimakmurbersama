import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { CATEGORIES, formatRupiah } from '../data';
import { linkProps } from '../router';
import { useCart } from './CartContext';

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
}

export const categoryLabel = (name: string) =>
  CATEGORIES.find((c) => c.name === name)?.label ?? name;

export default function ProductCard({ product, isNew }: ProductCardProps) {
  const { addToCart } = useCart();
  const stok = product.stok ?? 0;
  const soldOut = stok <= 0;
  const lowStock = !soldOut && stok <= 10;
  const link = linkProps(`/produk/${product.id}`);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!soldOut) addToCart(product);
  };

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-soft">
        <a {...link} className="block h-full w-full" aria-label={product.name}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${soldOut ? 'opacity-50 grayscale' : ''}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <ShoppingBag className="h-10 w-10" />
          </div>
        )}
        </a>

        {/* Badge pojok kiri atas */}
        <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1">
          {soldOut ? (
            <span className="bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Stok Habis</span>
          ) : (
            <>
              {isNew && (
                <span className="bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Terbaru</span>
              )}
              {lowStock && (
                <span className="bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Sisa {stok}</span>
              )}
            </>
          )}
        </div>

        {/* Tombol tambah cepat: muncul saat hover di desktop, selalu ada di HP */}
        {!soldOut && (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="absolute bottom-0 left-0 right-0 hidden translate-y-full items-center justify-center gap-2 bg-ink py-3 text-xs font-bold uppercase tracking-widest text-white transition-transform duration-300 group-hover:translate-y-0 md:flex hover:bg-brand"
          >
            <ShoppingBag className="h-4 w-4" />
            Tambah ke Keranjang
          </button>
        )}
        {!soldOut && (
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-md md:hidden"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        )}
      </div>

      <a {...link} className="flex flex-1 flex-col pt-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
          {categoryLabel(product.category)}
        </span>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-ink group-hover:underline">
          {product.name}
        </h3>
        {product.packaging && (
          <span className="mt-1 text-xs text-muted line-clamp-1">{product.packaging}</span>
        )}
        <span className="mt-2 font-heading text-base font-extrabold text-ink">
          {formatRupiah(product.price)}
        </span>
      </a>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-soft" />
      <div className="mt-3 h-3 w-1/3 bg-soft" />
      <div className="mt-2 h-4 w-4/5 bg-soft" />
      <div className="mt-2 h-4 w-1/2 bg-soft" />
    </div>
  );
}
