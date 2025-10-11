import Link from 'next/link';
import { Business } from '@/domain/entities/Business';
import RestaurantCard from '../RestaurantCard/RestaurantCard';
import styles from './FeaturedSection.module.scss';

interface FeaturedSectionProps {
  title: string;
  businesses: Business[];
  viewAllLink: string;
}

const FeaturedSection = ({ title, businesses, viewAllLink }: FeaturedSectionProps) => {
  if (!businesses || businesses.length === 0) {
    return null;
  }

  return (
    <section className={styles.featuredSection}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <Link href={viewAllLink} className={styles.viewAll}>
          شاهد الكل
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Desktop: Horizontal scroll */}
      <div className={styles.desktopScroll}>
        <div className={styles.scrollContainer}>
          {businesses.map((business) => (
            <div key={business.id} className={styles.cardWrapper}>
              <RestaurantCard business={business} />
            </div>
          ))}
        </div>
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
