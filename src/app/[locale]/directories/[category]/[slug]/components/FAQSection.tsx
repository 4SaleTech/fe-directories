'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FAQ } from '@/domain/entities/Business';
import styles from './FAQSection.module.scss';

interface FAQSectionProps {
  faqs: FAQ[];
  locale: string;
}

const FAQSection = ({ faqs, locale }: FAQSectionProps) => {
  const t = useTranslations('business');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  // FAQs are now pre-filtered and sorted on the server
  if (!faqs || faqs.length === 0) {
    return null;
  }

  const toggleItem = (faqId: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  return (
    <section id="faqs" className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('faqs')}</h2>
      <div className={styles.faqList}>
        {faqs.map((faq) => {
          const isOpen = openItems.has(faq.id);
          // API already returns localized data based on language
          const question = faq.question;
          const answer = faq.answer;

          return (
            <div key={faq.id} className={styles.faqItem}>
              <button
                className={`${styles.faqQuestion} ${isOpen ? styles.open : ''}`}
                onClick={() => toggleItem(faq.id)}
                aria-expanded={isOpen}
              >
                <span className={styles.questionText}>{question}</span>
                <svg
                  className={styles.chevron}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M6 8L10 12L14 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div
                className={`${styles.faqAnswer} ${isOpen ? styles.open : ''}`}
                aria-hidden={!isOpen}
              >
                <div className={styles.answerContent}>
                  <p className={styles.answerText}>{answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
