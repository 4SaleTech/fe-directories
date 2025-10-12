import { Business, Branch, WorkingHours, FAQ } from '@/domain/entities/Business';
import { BranchesSection, WorkingHoursSection, FAQSection } from './';
import styles from './TabContent.module.scss';

interface AboutTabContentProps {
  business: Business;
  locale: string;
  branches?: Branch[];
  workingHours?: WorkingHours[];
  faqs?: FAQ[];
}

export default function AboutTabContent({
  business,
  locale,
  branches,
  workingHours,
  faqs,
}: AboutTabContentProps) {
  const businessDescription = locale === 'ar' ? business.about_ar : business.about;

  return (
    <div className={styles.tabContent}>
      {/* About Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {locale === 'ar' ? 'عن المحل' : 'About'}
        </h2>
        {businessDescription && (
          <p className={styles.description}>{businessDescription}</p>
        )}
      </section>

      {/* Branches Section */}
      {branches && branches.length > 0 && (
        <BranchesSection branches={branches} locale={locale} />
      )}

      {/* Working Hours Section */}
      {workingHours && workingHours.length > 0 && (
        <WorkingHoursSection workingHours={workingHours} locale={locale} />
      )}

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <FAQSection faqs={faqs} locale={locale} />
      )}
    </div>
  );
}
