'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Category } from '@/domain/entities/Category';
import styles from './MobileMenu.module.scss';

interface MobileMenuProps {
  categories: Category[];
  locale: string;
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ categories, locale, isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        <div className={styles.menuHeader}>
          <h2 className={styles.menuTitle}>
            {locale === 'ar' ? 'التصنيفات' : 'Categories'}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label={locale === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className={styles.menuContent}>
          <ul className={styles.categoryList}>
            {categories.map((category) => {
              const href = `/${locale}/directories/${category.slug}`;
              const isActive = pathname?.includes(`/directories/${category.slug}`);

              return (
                <li key={category.id} className={styles.categoryItem}>
                  <Link
                    href={href}
                    className={`${styles.categoryLink} ${isActive ? styles.active : ''}`}
                    onClick={onClose}
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
                    <span className={styles.arrow}>
                      {locale === 'ar' ? '‹' : '›'}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* View All Categories Link */}
          <div className={styles.viewAllSection}>
            <Link
              href={`/${locale}/directories`}
              className={styles.viewAllLink}
              onClick={onClose}
            >
              {locale === 'ar' ? 'عرض جميع التصنيفات' : 'View All Categories'}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
