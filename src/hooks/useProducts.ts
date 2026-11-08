import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Product } from '../types';

// Produk diambil sekali lalu disimpan, supaya pindah halaman tidak memuat ulang.
let cache: Product[] | null = null;
let pending: Promise<Product[]> | null = null;

function loadProducts(): Promise<Product[]> {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = Promise.resolve(
      supabase.from('products').select('*').order('created_at', { ascending: false })
    )
      .then(({ data, error }) => {
        if (error) throw error;
        cache = (data || []) as Product[];
        return cache;
      })
      .catch((err) => {
        console.error('Gagal memuat produk:', err);
        pending = null;
        return [] as Product[];
      });
  }
  return pending;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let active = true;
    loadProducts().then((list) => {
      if (!active) return;
      setProducts(list);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { products, loading };
}
