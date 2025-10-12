'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  locale: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ locale, placeholder, onSearch }: SearchBarProps) {
  const t = useTranslations('search');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('query') as string;

    if (onSearch) {
      onSearch(query);
    } else if (query.trim()) {
      router.push(`/${locale}/directories?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <div className={styles.searchField}>
        <input
          type="text"
          name="query"
          className={styles.input}
          placeholder={placeholder || t('placeholder')}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />
        <button type="submit" className={styles.searchIcon} aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </form>
  );
}
