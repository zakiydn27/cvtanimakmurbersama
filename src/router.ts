import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { CATEGORIES } from './data';

export type Route =
  | { name: 'home' }
  | { name: 'produk'; category: string | null }
  | { name: 'detail'; id: string }
  | { name: 'keunggulan' }
  | { name: 'artikel' }
  | { name: 'artikel-detail'; id: string }
  | { name: 'kontak' }
  | { name: 'official-store' }
  | { name: 'cart' };

export const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export const categoryPath = (category: string | null) =>
  category ? `/kategori/${slugify(category)}` : '/produk';

function categoryFromSlug(slug: string): string | null {
  return CATEGORIES.find((c) => slugify(c.name) === slug)?.name ?? null;
}

export function parsePath(pathname: string): Route {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const [first, second, third] = parts;

  switch (first) {
    case undefined:
    case 'beranda':
      return { name: 'home' };
    case 'produk':
      return second ? { name: 'detail', id: second } : { name: 'produk', category: null };
    case 'kategori': {
      // Format lama: /kategori/<nomor>/<slug>. Format baru: /kategori/<slug>
      const slug = third ?? second ?? '';
      return { name: 'produk', category: categoryFromSlug(slug) };
    }
    case 'artikel':
      return second ? { name: 'artikel-detail', id: second } : { name: 'artikel' };
    case 'keunggulan':
      return { name: 'keunggulan' };
    case 'kontak':
      return { name: 'kontak' };
    case 'official-store':
      return { name: 'official-store' };
    case 'cart':
    case 'keranjang':
      return { name: 'cart' };
    default:
      return { name: 'home' };
  }
}

const EVENT = 'app:navigate';

export function navigate(path: string) {
  if (path !== window.location.pathname) {
    window.history.pushState(null, '', path);
  }
  window.dispatchEvent(new Event(EVENT));
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parsePath(window.location.pathname));

  useEffect(() => {
    const update = () => setRoute(parsePath(window.location.pathname));
    window.addEventListener('popstate', update);
    window.addEventListener(EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(EVENT, update);
    };
  }, []);

  return route;
}

/** Props untuk <a> agar klik biasa ditangani router, tapi Ctrl/Cmd+klik tetap membuka tab baru. */
export function linkProps(path: string, onClick?: () => void) {
  return {
    href: path,
    onClick: (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      onClick?.();
      navigate(path);
    },
  };
}
