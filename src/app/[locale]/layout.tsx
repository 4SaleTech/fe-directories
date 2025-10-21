import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';
import { categoryRepository } from '@/infrastructure/repositories/CategoryRepository';
import Navbar from '@/presentation/components/Navbar';
import '@/presentation/styles/globals.scss';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  // Determine direction based on locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Fetch categories for navigation
  let categories = [];
  try {
    categories = await categoryRepository.getAllCategories(locale);
  } catch (error) {
    console.error('Failed to fetch categories for navbar:', error);
  }

  return (
    <html lang={locale} dir={dir}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar categories={categories} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
