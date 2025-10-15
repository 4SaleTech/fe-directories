'use client';

import { useState, useEffect } from 'react';
import ReviewsSection from './ReviewsSection';
import ReviewCard from './ReviewCard';
import styles from './TabContent.module.scss';
import { reviewRepository } from '@/infrastructure/repositories/ReviewRepository';
import { Review } from '@/domain/entities/Review';

interface ReviewsTabContentProps {
  businessSlug: string;
  locale: string;
}

export default function ReviewsTabContent({ businessSlug, locale }: ReviewsTabContentProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await reviewRepository.getReviewsBySlug(businessSlug, 1, 10);
      setReviews(response.reviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(locale === 'ar' ? 'فشل في تحميل التقييمات' : 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [businessSlug, locale]);

  useEffect(() => {
    // Listen for the reviewAdded event
    const handleReviewAdded = () => {
      fetchReviews();
    };

    window.addEventListener('reviewAdded', handleReviewAdded);

    return () => {
      window.removeEventListener('reviewAdded', handleReviewAdded);
    };
  }, [businessSlug, locale]);

  return (
    <div className={styles.tabContent}>
      <ReviewsSection
        locale={locale}
        businessSlug={businessSlug}
      />

      <section style={{ paddingTop: '24px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '24px',
          color: '#1A1A1A'
        }}>
          {locale === 'ar' ? 'التعليقات' : 'Comments'}
        </h2>

        {isLoading && (
          <p style={{ textAlign: 'center', color: '#666', padding: '24px' }}>
            {locale === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
          </p>
        )}

        {error && (
          <p style={{ textAlign: 'center', color: '#EF4444', padding: '24px' }}>
            {error}
          </p>
        )}

        {!isLoading && !error && reviews.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', padding: '24px' }}>
            {locale === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
          </p>
        )}

        {!isLoading && !error && reviews.map((review) => (
          <ReviewCard key={review.id} review={review} locale={locale} />
        ))}
      </section>
    </div>
  );
}
