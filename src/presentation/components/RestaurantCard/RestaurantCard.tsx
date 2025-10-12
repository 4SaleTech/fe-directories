'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Business } from '@/domain/entities/Business';
import styles from './RestaurantCard.module.scss';

interface RestaurantCardProps {
  business: Business;
  variant?: 'default' | 'compact';
}

const RestaurantCard = ({ business, variant = 'default' }: RestaurantCardProps) => {
  const locale = useLocale();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Create array of images - in production, this would use actual media array from the API
  // For now, only use cover_image once (no duplicates)
  const images = business.cover_image ? [business.cover_image] : ['/images/placeholder.jpg'];

  // Auto-scroll through images every 3 seconds (only if multiple images)
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Use category_slug if available, otherwise fallback to 'businesses'
  const categorySlug = business.category_slug || 'businesses';
  const businessUrl = `/${locale}/directories/${categorySlug}/${business.slug}`;

  return (
    <Link href={businessUrl} className={styles.restaurantCard}>
      <div className={styles.imageContainer}>
        <div className={styles.imageWrapper}>
          <Image
            src={images[currentImageIndex]}
            alt={business.name_ar || business.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 50vw, 250px"
          />
        </div>

        {/* Carousel Indicators - only show if more than one image */}
        {images.length > 1 && (
          <div className={styles.indicators}>
            {images.map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${index === currentImageIndex ? styles.active : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}

        {/* Business Avatar */}
        <div className={styles.avatar}>
          <Image
            src={business.cover_image || '/images/placeholder.jpg'}
            alt={business.name_ar || business.name}
            fill
            className={styles.avatarImage}
          />
        </div>

        {/* Top-right badges */}
        <div className={styles.badges}>
          {business.is_featured && (
            <div className={styles.featuredBadge}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z"
                  fill="currentColor"
                />
              </svg>
              <span>مميز</span>
            </div>
          )}
          <button
            className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 10.5C6 10.5 1.5 7.75 1.5 4.25C1.5 3.25 2 2 3.5 2C4.5 2 5.25 2.5 6 3.5C6.75 2.5 7.5 2 8.5 2C10 2 10.75 3.25 10.75 4.25C10.75 7.75 6 10.5 6 10.5Z"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{business.name_ar || business.name}</h3>

        <div className={styles.ratingRow}>
          <span className={styles.reviewCount}>({business.reviews_count || 250} تقييم)</span>
          <span className={styles.priceRange}>{business.price_range}</span>
          <div className={styles.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.5L9.84 5.24L14 5.86L11 8.78L11.68 13L8 11.04L4.32 13L5 8.78L2 5.86L6.16 5.24L8 1.5Z"
                  fill={i < Math.floor(business.rating || 0) ? '#FFB700' : '#E9EBF2'}
                />
              </svg>
            ))}
          </div>
          <div className={styles.rating}>
            <span className={styles.ratingValue}>{(business.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        {business.address && (
          <div className={styles.address}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 14C8 14 12 10.4183 12 7C12 4.23858 10.2091 2 8 2C5.79086 2 4 4.23858 4 7C4 10.4183 8 14 8 14Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="8" cy="7" r="1.5" fill="currentColor" />
            </svg>
            <span>{business.address}</span>
          </div>
        )}

        {business.tags && business.tags.length > 0 && (
          <div className={styles.tags}>
            {business.tags.map((tag, index) => (
              <span key={tag.id || index} className={styles.tag}>
                {tag.icon && <span className={styles.tagIcon}>{tag.icon}</span>}
                {locale === 'ar' ? (tag.name_ar || tag.name) : tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCard;
