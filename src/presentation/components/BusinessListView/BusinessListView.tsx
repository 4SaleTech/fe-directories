'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { Business } from '@/domain/entities/Business';
import { Tag } from '@/domain/entities/Tag';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import FilterDropdown from '../FilterDropdown/FilterDropdown';
import styles from './BusinessListView.module.scss';

interface BusinessListViewProps {
  category: {
    title: string;
    slug: string;
  };
  businesses: Business[];
  tags?: Tag[];
  selectedTag: string | null;
  filters?: {
    verified: boolean;
    featured: boolean;
    rating?: number;
    sort: string;
  };
}

const BusinessListView = ({ category, businesses, tags = [], selectedTag, filters }: BusinessListViewProps) => {
  const t = useTranslations('filters');
  const tCommon = useTranslations('common');
  const tBusiness = useTranslations('business');
  const locale = useLocale();

  // Define filter options
  const sortOptions = [
    { label: t('sort.rating'), value: 'rating' },
    { label: t('sort.newest'), value: 'newest' },
    { label: t('sort.views'), value: 'views' },
    { label: t('sort.name'), value: 'name' },
  ];

  const ratingOptions = [
    { label: t('rating.all'), value: 'all' },
    { label: t('rating.5stars'), value: '5' },
    { label: t('rating.4plus'), value: '4' },
    { label: t('rating.3plus'), value: '3' },
    { label: t('rating.2plus'), value: '2' },
    { label: t('rating.1plus'), value: '1' },
  ];

  const verifiedOptions = [
    { label: t('verified.all'), value: 'all' },
    { label: t('verified.verifiedOnly'), value: 'verified' },
    { label: t('verified.featuredOnly'), value: 'featured' },
    { label: t('verified.both'), value: 'both' },
  ];

  // Determine current verified filter value
  const getVerifiedValue = () => {
    if (filters?.verified && filters?.featured) return 'both';
    if (filters?.verified) return 'verified';
    if (filters?.featured) return 'featured';
    return 'all';
  };

  return (
    <div className={styles.businessListView}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <button className={styles.backButton} aria-label={tCommon('back')}>
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
        <h1 className={styles.mobileTitle}>{category.title}</h1>
      </div>

      <div className="container">
        {/* Desktop Title */}
        <h1 className={styles.desktopTitle}>{category.title}</h1>

        {/* Filter Chips */}
        {tags.length > 0 && (
          <div className={styles.filterChips}>
            {/* "All" button */}
            <Link
              href={`/${locale}/directories/${category.slug}`}
              className={`${styles.filterChip} ${
                selectedTag === null ? styles.active : ''
              }`}
            >
              {tCommon('all')}
            </Link>

            {/* Tag buttons */}
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/${locale}/directories/${category.slug}?tag=${tag.slug}`}
                className={`${styles.filterChip} ${
                  selectedTag === tag.slug ? styles.active : ''
                }`}
              >
                {locale === 'ar' ? tag.name : tag.name}
                {tag.icon && <span className={styles.badge}>{tag.icon}</span>}
              </Link>
            ))}
          </div>
        )}

        {/* Sort/Filter Bar */}
        <div className={styles.sortBar} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          <FilterDropdown
            label={t('rating.label')}
            options={ratingOptions}
            paramName="rating"
            currentValue={filters?.rating?.toString()}
          />

          <FilterDropdown
            label={t('verified.label')}
            options={verifiedOptions}
            paramName="filter"
            currentValue={getVerifiedValue()}
          />

          <FilterDropdown
            label={t('sort.label')}
            options={sortOptions}
            paramName="sort"
            currentValue={filters?.sort}
          />

          <button className={styles.filtersButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4H14M4 8H12M6 12H10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{locale === 'ar' ? 'فلاتر' : 'Filters'}</span>
          </button>
        </div>

        {/* Business Grid */}
        <div className={styles.businessGrid}>
          {businesses.length > 0 ? (
            businesses.map((business) => (
              <RestaurantCard key={business.id} business={business} />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>{tBusiness('noResults')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Buttons */}
      <div className={styles.floatingButtons}>
        <button className={styles.floatingButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 7H21M3 12H21M3 17H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>{t('sort.label')}</span>
        </button>
        <button className={styles.floatingButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="12" cy="10" r="2" fill="currentColor" />
          </svg>
          <span>{tCommon('map')}</span>
        </button>
      </div>
    </div>
  );
};

export default BusinessListView;
