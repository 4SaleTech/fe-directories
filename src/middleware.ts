import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // List of all supported locales
  locales,

  // Default locale
  defaultLocale,

  // Locale detection strategy
  localeDetection: true,

  // Always use locale prefix (e.g., /ar/... or /en/...)
  localePrefix: 'always',
});

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - _next (Next.js internals)
  // - Static files (images, fonts, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
