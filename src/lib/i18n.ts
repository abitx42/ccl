export const locales = ['mr', 'en', 'hi'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'mr';

function withoutLocalePrefix(pathname: string): string {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;

  for (const locale of locales) {
    if (normalized === `/${locale}`) return '/';
    if (normalized.startsWith(`/${locale}/`)) return normalized.slice(locale.length + 1);
  }

  return normalized;
}

/** Build a URL for a route while keeping the default locale at the site root. */
export function localizedPath(locale: Locale, pathname = '/'): string {
  const cleanPath = withoutLocalePrefix(pathname) || '/';
  if (locale === defaultLocale) return cleanPath;
  return cleanPath === '/' ? `/${locale}/` : `/${locale}${cleanPath}`;
}

/** Localize a path, query string, or hash without duplicating locale prefixes. */
export function localizedHref(locale: Locale, href = '/'): string {
  const match = href.match(/^([^?#]*)([?#].*)?$/);
  const pathname = match?.[1] || '/';
  return `${localizedPath(locale, pathname)}${match?.[2] || ''}`;
}
