import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Article } from '../types';

let cache: Article[] | null = null;

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) return;
    let active = true;
    Promise.resolve(
      supabase.from('articles').select('*').order('published_at', { ascending: false })
    )
      .then(({ data, error }) => {
        if (error) throw error;
        // Kolom di database bernama published_at, di UI dipakai publishedAt
        cache = (data || []).map((item: any) => ({
          ...item,
          publishedAt: item.published_at || item.publishedAt,
        })) as Article[];
        if (active) setArticles(cache);
      })
      .catch((err) => console.error('Gagal memuat artikel:', err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { articles, loading };
}
