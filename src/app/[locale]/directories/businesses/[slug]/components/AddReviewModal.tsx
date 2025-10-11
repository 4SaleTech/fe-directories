'use client';

import { useState, useRef } from 'react';
import styles from './AddReviewModal.module.scss';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string, images: File[]) => void;
  locale: string;
}

const AddReviewModal = ({ isOpen, onClose, onSubmit, locale }: AddReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating === 0) {
      alert(locale === 'ar' ? 'الرجاء اختيار التقييم' : 'Please select a rating');
      return;
    }
    if (comment.trim() === '') {
      alert(locale === 'ar' ? 'الرجاء كتابة تعليق' : 'Please write a comment');
      return;
    }
    onSubmit(rating, comment, images);
    handleClose();
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setImages([]);
    onClose();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {locale === 'ar' ? 'أضف تقييمك' : 'Add Your Review'}
          </h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Rating Stars */}
        <div className={styles.ratingSection}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={styles.starButton}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path
                  d="M20 5L24.5 15H35L26.5 22L30 32L20 25L10 32L13.5 22L5 15H15.5L20 5Z"
                  fill={star <= (hoveredRating || rating) ? '#FFB700' : 'none'}
                  stroke={star <= (hoveredRating || rating) ? '#FFB700' : '#E5E7EB'}
                  strokeWidth="2"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* Comment Textarea */}
        <div className={styles.commentSection}>
          <textarea
            className={styles.textarea}
            placeholder={locale === 'ar' ? 'اكتب تعليقك' : 'Write your comment'}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
          />
        </div>

        {/* Image Upload */}
        <div className={styles.imageSection}>
          <button
            className={styles.addImageButton}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 16L8 11L10 13L14 9L17 12M3 5H17C17.5523 5 18 5.44772 18 6V14C18 14.5523 17.5523 15 17 15H3C2.44772 15 2 14.5523 2 14V6C2 5.44772 2.44772 5 3 5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{locale === 'ar' ? 'أضف صورة' : 'Add Image'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className={styles.imagePreview}>
            {images.map((image, index) => (
              <div key={index} className={styles.imageItem}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className={styles.previewImage}
                />
                <button
                  className={styles.removeImageButton}
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button className={styles.submitButton} onClick={handleSubmit}>
          {locale === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

export default AddReviewModal;
