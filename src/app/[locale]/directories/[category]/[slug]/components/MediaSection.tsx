'use client';

import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';
import { BusinessMedia } from '@/domain/entities/Business';
import styles from './MediaSection.module.scss';

interface MediaSectionProps {
  media: BusinessMedia[];
  locale?: string;
  title?: string;
  isMenuLayout?: boolean;
}

const MediaSection = ({ media, locale, title, isMenuLayout = false }: MediaSectionProps) => {
  const t = useTranslations('business');
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isRTL = locale === 'ar';

  if (!media || media.length === 0) {
    return null;
  }

  const handleMediaClick = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedMediaIndex(null);
  };

  const handlePrevious = () => {
    if (selectedMediaIndex !== null && selectedMediaIndex > 0) {
      setSelectedMediaIndex(selectedMediaIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedMediaIndex !== null && selectedMediaIndex < media.length - 1) {
      setSelectedMediaIndex(selectedMediaIndex + 1);
    }
  };

  const selectedMedia = selectedMediaIndex !== null ? media[selectedMediaIndex] : null;

  return (
    <section id="media" className={styles.section}>
      <h2 className={styles.sectionTitle}>{title || t('media')}</h2>
      <div className={isMenuLayout ? styles.menuGrid : styles.mediaGrid}>
        {media.map((item, index) => (
          <div
            key={item.id}
            className={isMenuLayout ? styles.menuItem : styles.mediaItem}
            onClick={() => handleMediaClick(index)}
          >
            <div className={styles.mediaContainer}>
              <img
                src={item.type === 'video' ? item.thumbnail_url || item.url : item.url}
                alt={item.caption || ''}
                className={styles.mediaImage}
              />
              {item.type === 'video' && (
                <div className={styles.playButton}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,0.5)" />
                    <path
                      d="M16 12L28 20L16 28V12Z"
                      fill="white"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing media */}
      {selectedMedia && (
        <div className={styles.modal} onClick={handleCloseModal}>
          {/* Close button */}
          <button
            className={styles.closeButton}
            onClick={handleCloseModal}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Media viewer with navigation */}
          <div className={styles.mediaViewer} onClick={(e) => e.stopPropagation()}>
            {/* Left button in LTR (Previous), Right button in RTL (Next) */}
            {selectedMediaIndex !== null && (isRTL ? selectedMediaIndex < media.length - 1 : selectedMediaIndex > 0) && (
              <button
                className={styles.navButton}
                onClick={isRTL ? handleNext : handlePrevious}
                aria-label={isRTL ? "Next" : "Previous"}
                style={{ order: isRTL ? 2 : 0 }}
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

            {/* Media content */}
            <div className={styles.mediaContent} style={{ order: 1 }}>
              {selectedMedia.type === 'video' ? (
                <video
                  ref={videoRef}
                  src={selectedMedia.url}
                  controls
                  autoPlay
                  className={styles.modalMedia}
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.caption || ''}
                  className={styles.modalMedia}
                />
              )}
            </div>

            {/* Right button in LTR (Next), Left button in RTL (Previous) */}
            {selectedMediaIndex !== null && (isRTL ? selectedMediaIndex > 0 : selectedMediaIndex < media.length - 1) && (
              <button
                className={styles.navButton}
                onClick={isRTL ? handlePrevious : handleNext}
                aria-label={isRTL ? "Previous" : "Next"}
                style={{ order: isRTL ? 0 : 2 }}
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
        </div>
      )}
    </section>
  );
};

export default MediaSection;
