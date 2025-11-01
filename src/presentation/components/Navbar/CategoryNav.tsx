'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Category } from '@/domain/entities/Category';
import styles from './CategoryNav.module.scss';

interface CategoryNavProps {
  categories: Category[];
  locale: string;
}

const CategoryNav = ({ categories, locale }: CategoryNavProps) => {
  const pathname = usePathname();

  // Limit categories shown in navbar (show first 5, rest in "More" if needed)
  const visibleCategories = categories.slice(0, 5);
  const hasMore = categories.length > 5;

  // Check if we're on the main directories page
  const isOnDirectoriesPage = pathname === `/${locale}/directories`;

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
                <span className={styles.categoryIcon}>
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={20}
                    height={20}
                  />
                </span>
              )}
              <span className={styles.categoryName}>{category.name}</span>
            </Link>
          </li>
        );
      })}

      {/* "View All" or "More" link if there are too many categories */}
      {hasMore && !isOnDirectoriesPage && (
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
