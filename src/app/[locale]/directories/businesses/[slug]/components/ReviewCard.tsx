'use client';

import { useState } from 'react';
import styles from './ReviewCard.module.scss';

interface Review {
  id: number;
  businessId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount?: number;
  isHelpful?: boolean;
}

interface ReviewCardProps {
  review: Review;
  locale: string;
}

const ReviewCard = ({ review, locale }: ReviewCardProps) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [isHelpful, setIsHelpful] = useState(review.isHelpful || false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);

  const handleHelpful = () => {
    if (!isHelpful) {
      setHelpfulCount(helpfulCount + 1);
      setIsHelpful(true);
    }
  };

  const toggleComment = () => {
    setShowFullComment(!showFullComment);
  };

  const formatDate = (dateString: string) => {
    // Simple date formatting - can be enhanced
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={index < rating ? styles.starFilled : styles.starEmpty}
      >
        ★
      </span>
    ));
  };

  const isLongComment = review.comment.length > 200;
  const displayedComment = showFullComment || !isLongComment
    ? review.comment
    : review.comment.substring(0, 200) + '...';

  return (
    <div className={styles.reviewCard}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {review.userAvatar ? (
              <img src={review.userAvatar} alt={review.userName} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {review.userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className={styles.userDetails}>
            <h4 className={styles.userName}>{review.userName}</h4>
            <span className={styles.date}>{formatDate(review.createdAt)}</span>
          </div>
        </div>

        <button className={styles.menuButton} aria-label="More options">
          ⋮
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.rating}>{renderStars(review.rating)}</div>

        <p className={styles.comment}>{displayedComment}</p>

        {isLongComment && (
          <button className={styles.readMore} onClick={toggleComment}>
            {showFullComment
              ? (locale === 'ar' ? 'عرض أقل' : 'Show less')
              : (locale === 'ar' ? 'عرض المزيد' : 'Read more')}
          </button>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.helpfulButton} ${isHelpful ? styles.active : ''}`}
          onClick={handleHelpful}
          disabled={isHelpful}
        >
          <span className={styles.icon}>👍</span>
          <span className={styles.label}>
            {locale === 'ar' ? 'مفيد' : 'Helpful'}
          </span>
          {helpfulCount > 0 && (
            <span className={styles.count}>({helpfulCount})</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
