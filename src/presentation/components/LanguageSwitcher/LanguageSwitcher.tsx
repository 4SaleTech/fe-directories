'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className={styles.languageSwitcher}>
      <button
        className={`${styles.languageButton} ${locale === 'ar' ? styles.active : ''}`}
        onClick={() => switchLocale('ar')}
        aria-label="Switch to Arabic"
      >
        العربية
      </button>
      <button
        className={`${styles.languageButton} ${locale === 'en' ? styles.active : ''}`}
        onClick={() => switchLocale('en')}
        aria-label="Switch to English"
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;
