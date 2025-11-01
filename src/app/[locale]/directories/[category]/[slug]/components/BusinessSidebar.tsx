'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Business } from '@/domain/entities/Business';
import styles from './BusinessSidebar.module.scss';

interface BusinessSidebarProps {
  business: Business;
  locale: string;
}

const BusinessSidebar = ({ business, locale }: BusinessSidebarProps) => {
  const t = useTranslations('business');
  const [isFollowing, setIsFollowing] = useState(false);

  // Use computed display fields from backend (includes fallback logic)
  const businessName = business.display_title;
  const businessDescription = business.display_description || (locale === 'ar' ? business.about_ar : business.about);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: businessName,
        text: businessDescription || '',
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleCallNow = () => {
    if (business.contact_info?.contact_numbers && business.contact_info.contact_numbers.length > 0) {
      const phoneNumber = business.contact_info.contact_numbers[0];
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <aside className={styles.sidebar}>
      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.bannerImage}>
          <Image
            src={business.cover_image || '/images/placeholder-banner.jpg'}
            alt={businessName}
            fill
            className={styles.bannerImg}
            sizes="384px"
            priority
          />
        </div>

        {/* Business Avatar */}
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            <Image
              src={business.logo || business.cover_image || '/images/placeholder.jpg'}
              alt={businessName}
              fill
              className={styles.avatarImg}
            />
          </div>
          {business.attributes?.verified === 'true' && (
            <div className={styles.verifiedBadge}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="#0062FF" />
                <path
                  d="M7 10L9 12L13 8"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            className={styles.shareButton}
            onClick={handleShare}
            aria-label={t('share')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 6.5C16.3807 6.5 17.5 5.38071 17.5 4C17.5 2.61929 16.3807 1.5 15 1.5C13.6193 1.5 12.5 2.61929 12.5 4C12.5 5.38071 13.6193 6.5 15 6.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M5 12.5C6.38071 12.5 7.5 11.3807 7.5 10C7.5 8.61929 6.38071 7.5 5 7.5C3.61929 7.5 2.5 8.61929 2.5 10C2.5 11.3807 3.61929 12.5 5 12.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M15 18.5C16.3807 18.5 17.5 17.3807 17.5 16C17.5 14.6193 16.3807 13.5 15 13.5C13.6193 13.5 12.5 14.6193 12.5 16C12.5 17.3807 13.6193 18.5 15 18.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7.5 11L12.5 14.5M7.5 9L12.5 5.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            {t('share')}
          </button>

          <button
            className={`${styles.followButton} ${isFollowing ? styles.following : ''}`}
            onClick={handleFollow}
            aria-label={isFollowing ? t('unfollow') : t('follow')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 17.5C10 17.5 2.5 13 2.5 7C2.5 5.5 3.5 3 6 3C7.5 3 8.75 3.75 10 5.5C11.25 3.75 12.5 3 14 3C16.5 3 17.5 5.5 17.5 7C17.5 13 10 17.5 10 17.5Z"
                fill={isFollowing ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isFollowing ? t('following') : t('follow')}
          </button>
        </div>

        {/* Business Name */}
        <h1 className={styles.businessName}>{businessName}</h1>

        {/* Rating */}
        <div className={styles.ratingSection}>
          <div className={styles.ratingValue}>{(business.rating?.average || 0).toFixed(1)}</div>
          <div className={styles.stars}>
            {[0, 1, 2, 3, 4].map((i) => {
              const averageRating = business.rating?.average || 0;
              const filledStars = Math.floor(averageRating);
              return (
                <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2L12.1 7.3L18 8.1L14 12L15 18L10 15.3L5 18L6 12L2 8.1L7.9 7.3L10 2Z"
                    fill={i < filledStars ? '#FFB700' : '#E9EBF2'}
                  />
                </svg>
              );
            })}
          </div>
          <div className={styles.reviewCount}>
            ({business.rating?.count || 0} {t('reviews')})
          </div>
        </div>

        {/* Description */}
        {businessDescription && (
          <p className={styles.description}>{businessDescription}</p>
        )}

        {/* Website Link */}
        {business.contact_info?.website && (
          <a
            href={business.contact_info.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.websiteLink}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M2.5 10H17.5M10 2.5C11.5 4.5 12 7 12 10C12 13 11.5 15.5 10 17.5M10 2.5C8.5 4.5 8 7 8 10C8 13 8.5 15.5 10 17.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span className={styles.websiteText}>{t('visitWebsite')}</span>
          </a>
        )}

        {/* Call Now Button */}
        {business.contact_info?.contact_numbers && business.contact_info.contact_numbers.length > 0 && (
          <button className={styles.callButton} onClick={handleCallNow}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M17.5 14.5V16.5C17.5 17.3284 16.8284 18 16 18H15.5C7.49187 18 2 12.5081 2 4.5V4C2 3.17157 2.67157 2.5 3.5 2.5H5.5C6.05228 2.5 6.5 2.94772 6.5 3.5V6.5C6.5 7.05228 6.05228 7.5 5.5 7.5H4.5C4.5 11.6421 7.85786 15 12 15V14C12 13.4477 12.4477 13 13 13H16C16.5523 13 17 13.4477 17 14V14.5Z"
                fill="currentColor"
              />
            </svg>
            {t('callNow')}
          </button>
        )}

        {/* WhatsApp Button */}
        {business.contact_info?.whatsapp && business.contact_info.whatsapp.length > 0 && (
          <a
            href={`https://wa.me/${business.contact_info.whatsapp[0].replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C5.58 2 2 5.58 2 10C2 11.5 2.44 12.89 3.2 14.04L2 18L6.04 16.82C7.13 17.5 8.43 17.9 9.86 17.9H10C14.42 17.9 18 14.32 18 9.9C18 7.75 17.14 5.75 15.64 4.24C14.14 2.73 12.14 1.89 10 2ZM10 16.5C8.75 16.5 7.53 16.14 6.5 15.5L6.25 15.32L3.86 15.96L4.51 13.63L4.31 13.36C3.59 12.29 3.2 11.05 3.2 9.75C3.2 6.34 6.04 3.5 9.45 3.5C11.08 3.5 12.62 4.13 13.79 5.29C14.95 6.45 15.58 7.99 15.58 9.62C15.58 13.03 12.74 15.87 9.33 15.87H10Z"
                fill="currentColor"
              />
            </svg>
            {t('chatOnWhatsApp')}
          </a>
        )}

        {/* Social Media Links */}
        {business.social_media && (
          <div className={styles.socialMedia}>
            {business.social_media.facebook && (
              <a
                href={business.social_media.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2C5.58 2 2 5.58 2 10C2 14.03 5.01 17.4 8.96 17.92V12.38H6.96V10H8.96V8.18C8.96 6.2 10.16 5.1 11.96 5.1C12.82 5.1 13.72 5.26 13.72 5.26V7.2H12.72C11.74 7.2 11.42 7.82 11.42 8.46V10H13.62L13.26 12.38H11.42V17.92C15.37 17.4 18.38 14.03 18.38 10C18.38 5.58 14.8 2 10.38 2H10Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            )}
            {business.social_media.instagram && (
              <a
                href={business.social_media.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="15" cy="5" r="1" fill="currentColor" />
                </svg>
              </a>
            )}
            {business.social_media.twitter && (
              <a
                href={business.social_media.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Twitter"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M18 4.5C17.4 4.8 16.8 5 16.1 5.1C16.8 4.7 17.3 4.1 17.5 3.3C16.9 3.7 16.2 4 15.4 4.1C14.8 3.5 13.9 3.1 13 3.1C11.3 3.1 9.8 4.6 9.8 6.5C9.8 6.8 9.8 7 9.9 7.2C7.2 7.1 4.8 5.8 3.2 3.8C2.9 4.3 2.7 4.9 2.7 5.6C2.7 6.8 3.3 7.9 4.2 8.5C3.7 8.5 3.1 8.3 2.7 8.1V8.1C2.7 9.7 3.8 11 5.3 11.3C5 11.4 4.7 11.4 4.4 11.4C4.2 11.4 4 11.4 3.8 11.3C4.2 12.6 5.4 13.6 6.9 13.6C5.8 14.5 4.4 15 2.8 15C2.5 15 2.3 15 2 15C3.5 15.9 5.2 16.5 7.1 16.5C13 16.5 16.2 11.5 16.2 7.2V6.7C16.8 6.3 17.4 5.8 17.9 5.2L18 4.5Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default BusinessSidebar;
