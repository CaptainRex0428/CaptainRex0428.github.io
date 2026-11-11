import zh from './zh.json';
import en from './en.json';

export type Locale = 'zh' | 'en';
export type Translations = typeof zh;

const translations: Record<Locale, Translations> = { zh, en };

export function useTranslations(locale: Locale): Translations {
  return translations[locale];
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Locale;
  return 'zh';
}

export function getLocalizedPath(path: string, locale: Locale): string {
  const cleanPath = path.replace(/^\/(zh|en)/, '');
  return locale === 'zh' ? cleanPath || '/' : `/${locale}${cleanPath}`;
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'zh' ? 'en' : 'zh';
}

/**
 * 语言切换目标地址。
 * 英文站目前只有首页 / 博客列表 / 作品列表 / 关于四个页面；
 * 内页（文章、作品详情、合集、标签）没有英文版，统一落到对应列表页，
 * 避免切换后 404。
 */
export function getAlternateHref(pathname: string, alternate: Locale): string {
  const base = (pathname.replace(/^\/(zh|en)(?=\/|$)/, '') || '/').replace(/\/+$/, '') || '/';
  if (alternate === 'zh') return base;
  if (base === '/' || base === '/blog' || base === '/works' || base === '/about') {
    return base === '/' ? '/en' : `/en${base}`;
  }
  if (base.startsWith('/blog')) return '/en/blog';
  if (base.startsWith('/works')) return '/en/works';
  return '/en';
}

export const locales: Locale[] = ['zh', 'en'];