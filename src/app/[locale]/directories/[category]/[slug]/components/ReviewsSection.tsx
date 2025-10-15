'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import AddReviewModal from './AddReviewModal';
import LoginModal from './LoginModal';
import styles from './ReviewsSection.module.scss';
import { reviewRepository } from '@/infrastructure/repositories/ReviewRepository';

interface RatingBreakdown {
  stars: number;
  count: number;
  percentage: number;
}

interface ReviewsSectionProps {
  locale: string;
  businessSlug: string;
}

const ReviewsSection = ({
  locale,
  businessSlug,
}: ReviewsSectionProps) => {
  const t = useTranslations('business');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [breakdown, setBreakdown] = useState<RatingBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const summary = await reviewRepository.getReviewSummaryBySlug(businessSlug);

        // Convert rating breakdown to display format
        const total = summary.totalReviews || 1; // Avoid division by zero
        const breakdownArray: RatingBreakdown[] = [5, 4, 3, 2, 1].map((stars) => {
          const count = summary.ratingBreakdown[stars.toString()] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          return { stars, count, percentage };
        });

        setBreakdown(breakdownArray);
      } catch (err) {
        console.error('Error fetching review summary:', err);
        // Keep empty breakdown on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [businessSlug]);

  const handleWriteReview = () => {
    // Check if user is authenticated
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
      // Show login modal if not authenticated
      setIsLoginModalOpen(true);
    } else {
      // Show review modal if authenticated
      setIsReviewModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    // After successful login, open the review modal
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (rating: number, comment: string, images: File[]) => {
    try {
      // TODO: Implement image upload to get URLs
      // For now, we'll submit without images
      if (images.length > 0) {
        alert(locale === 'ar' ? 'رفع الصور غير مدعوم حالياً' : 'Image upload not yet supported');
      }

      await reviewRepository.createReview(businessSlug, rating, comment);

      // Close the modal
      setIsReviewModalOpen(false);

      // Trigger a custom event to refresh the reviews list
      window.dispatchEvent(new CustomEvent('reviewAdded'));

      // Refresh the summary to update rating breakdown
      const summary = await reviewRepository.getReviewSummaryBySlug(businessSlug);
      const total = summary.totalReviews || 1;
      const breakdownArray: RatingBreakdown[] = [5, 4, 3, 2, 1].map((stars) => {
        const count = summary.ratingBreakdown[stars.toString()] || 0;
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return { stars, count, percentage };
      });
      setBreakdown(breakdownArray);
    } catch (err: any) {
      console.error('Error submitting review:', err);

      // Check if it's an authentication error
      if (err.response?.status === 401) {
        // Token might be expired, show login modal
        setIsReviewModalOpen(false);
        setIsLoginModalOpen(true);
      } else if (err.response?.status === 400 || err.response?.status === 409) {
        // Display the specific error message from backend
        const errorMessage = err.response?.data?.message || err.response?.data?.error;
        alert(errorMessage || (locale === 'ar' ? 'فشل في إرسال التقييم' : 'Failed to submit review'));
      } else {
        alert(locale === 'ar' ? 'فشل في إرسال التقييم' : 'Failed to submit review');
      }
    }
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {locale === 'ar' ? 'التقييمات' : 'Ratings'}
      </h2>

      <div className={styles.ratingAnalysis}>
        {breakdown.map((item) => (
          <div key={item.stars} className={styles.ratingRow}>
            <span className={styles.count}>({item.count})</span>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            <div className={styles.stars}>
              <span className={styles.starIcon}>★</span>
              <span className={styles.starNumber}>{item.stars}</span>
            </div>
          </div>
        ))}

        <button className={styles.writeReviewButton} onClick={handleWriteReview}>
          {locale === 'ar' ? 'أضف تقييمك' : 'Write Review'}
        </button>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        locale={locale}
      />

      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
        locale={locale}
      />
    </section>
  );
};

export default ReviewsSection;
