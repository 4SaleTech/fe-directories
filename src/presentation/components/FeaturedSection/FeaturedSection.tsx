'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Business } from '@/domain/entities/Business';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import styles from './FeaturedSection.module.scss';

interface FeaturedSectionProps {
  title: string;
  businesses: Business[];
  viewAllLink: string;
  locale?: string;
}

const FeaturedSection = ({ title, businesses, viewAllLink, locale = 'ar' }: FeaturedSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isRTL = locale === 'ar';
    const scrollLeft = Math.abs(container.scrollLeft);
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    if (isRTL) {
      setCanScrollLeft(scrollLeft < scrollWidth - clientWidth - 1);
      setCanScrollRight(scrollLeft > 1);
    } else {
      setCanScrollLeft(scrollLeft > 1);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [locale]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const isRTL = locale === 'ar';

    let targetScroll: number;
    if (isRTL) {
      targetScroll = direction === 'left'
        ? container.scrollLeft + scrollAmount
        : container.scrollLeft - scrollAmount;
    } else {
      targetScroll = direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
    }

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <section className={styles.featuredSection}>
      <div className={styles.header} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <h2 className={styles.title}>{title}</h2>
        <Link href={viewAllLink} className={styles.viewAll}>
          {locale === 'ar' ? 'شاهد الكل' : 'View All'}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d={locale === 'ar' ? 'M12.5 15L7.5 10L12.5 5' : 'M7.5 15L12.5 10L7.5 5'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Desktop: Carousel */}
      <div className={styles.carouselWrapper}>
        {canScrollLeft && (
          <button
            className={`${styles.navButton} ${styles.navButtonLeft}`}
            onClick={() => scroll('left')}
            aria-label={locale === 'ar' ? 'السابق' : 'Previous'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className={styles.desktopScroll}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          {businesses.map((business) => (
            <div key={business.id} className={styles.cardWrapper}>
              <RestaurantCard business={business} />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            className={`${styles.navButton} ${styles.navButtonRight}`}
            onClick={() => scroll('right')}
            aria-label={locale === 'ar' ? 'التالي' : 'Next'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className={styles.mobileGrid}>
        {businesses.map((business) => (
          <RestaurantCard key={business.id} business={business} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
