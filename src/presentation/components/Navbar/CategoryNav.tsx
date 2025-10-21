'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Category } from '@/domain/entities/Category';
import styles from './CategoryNav.module.scss';

interface CategoryNavProps {
  categories: Category[];
  locale: string;
}

const CategoryNav = ({ categories, locale }: CategoryNavProps) => {
  const pathname = usePathname();

  // Limit categories shown in navbar (show first 7, rest in "More" if needed)
  const visibleCategories = categories.slice(0, 7);
  const hasMore = categories.length > 7;

  return (
    <ul className={styles.categoryNav}>
      {visibleCategories.map((category) => {
        const href = `/${locale}/directories/${category.slug}`;
        const isActive = pathname?.includes(`/directories/${category.slug}`);

        return (
          <li key={category.id} className={styles.categoryItem}>
            <Link
              href={href}
              className={`${styles.categoryLink} ${isActive ? styles.active : ''}`}
            >
              {category.icon && (
                <span className={styles.categoryIcon}>{category.icon}</span>
              )}
              <span className={styles.categoryName}>{category.name}</span>
            </Link>
          </li>
        );
      })}

      {/* "View All" or "More" link if there are too many categories */}
      {hasMore && (
        <li className={styles.categoryItem}>
          <Link
            href={`/${locale}/directories`}
            className={styles.categoryLink}
          >
            <span className={styles.categoryName}>
              {locale === 'ar' ? 'المزيد' : 'More'}
            </span>
          </Link>
        </li>
      )}
    </ul>
  );
};

export default CategoryNav;
