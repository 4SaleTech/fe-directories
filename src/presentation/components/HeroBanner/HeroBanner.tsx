'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './HeroBanner.module.scss';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  propertyImage: string;
}

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: 'أكثر من ١٠٠+ إعلان الآن في',
      subtitle: 'عقارات 4Sale',
      ctaText: 'أستكشف الآن',
      ctaLink: '/directories/real-estate',
      propertyImage: '/images/hero-building.jpg',
    },
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={styles.heroBanner}>
      <div className={styles.slideContainer}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          >
            <div className={styles.background}>
              {/* Property Image */}
              <div className={styles.propertyImage}>
                <Image
                  src={slide.propertyImage}
                  alt="Property"
                  fill
                  className={styles.image}
                />
              </div>

              {/* Geometric Pattern */}
              <div className={styles.pattern}>
                <svg viewBox="0 0 759 260" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0L759 260V0H0Z" fill="url(#pattern-gradient)" fillOpacity="0.1" />
                </svg>
              </div>
            </div>

            <div className={styles.content}>
              <div className={styles.textGroup}>
                <p className={styles.subtitle}>{slide.title}</p>
                <h1 className={styles.title}>{slide.subtitle}</h1>
              </div>

              <div className={styles.badges}>
                <span className={styles.badge}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" fill="#EFF7FF" />
                    <path
                      d="M13 7L8.5 11.5L6.5 9.5"
                      stroke="#0062FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  موثوق به من قبل 4Sale
                </span>
                <span className={styles.badge}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" fill="#EFF7FF" />
                    <path
                      d="M13 7L8.5 11.5L6.5 9.5"
                      stroke="#0062FF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  موثوق به من قبل 4Sale
                </span>
              </div>

              <button className={styles.ctaButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {slide.ctaText}
              </button>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={handlePrevSlide}
          aria-label="الشريحة السابقة"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={handleNextSlide}
          aria-label="الشريحة التالية"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Indicators */}
        <div className={styles.indicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`الذهاب إلى الشريحة ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
