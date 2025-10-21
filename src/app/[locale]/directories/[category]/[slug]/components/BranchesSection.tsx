'use client';

import { useTranslations } from 'next-intl';
import { Branch } from '@/domain/entities/Business';
import styles from './BranchesSection.module.scss';

interface BranchesSectionProps {
  branches: Branch[];
  locale: string;
}

const BranchesSection = ({ branches, locale }: BranchesSectionProps) => {
  const t = useTranslations('business');

  if (!branches || branches.length === 0) {
    return null;
  }

  const handleMapClick = (branch: Branch) => {
    if (branch.latitude && branch.longitude) {
      // Open Google Maps with coordinates
      const url = `https://www.google.com/maps/search/?api=1&query=${branch.latitude},${branch.longitude}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to address search (already localized by API)
      const encodedAddress = encodeURIComponent(branch.address);
      const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCallClick = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <section id="branches" className={styles.section}>
      <h2 className={styles.sectionTitle}>{t('branches')}</h2>
      <div className={styles.branchesList}>
        {branches.map((branch) => {
          // API already returns localized data based on language
          const branchName = branch.name;
          const branchAddress = branch.address;

          return (
            <div key={branch.id} className={styles.branchCard}>
              <div className={styles.branchInfo}>
                <div className={styles.branchHeader}>
                  <h3 className={styles.branchName}>{branchName}</h3>
                  <button
                    className={styles.mapButton}
                    onClick={() => handleMapClick(branch)}
                    aria-label={t('viewOnMap')}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 17.5C10 17.5 15 12.5 15 8.75C15 5.57 12.76 3 10 3C7.24 3 5 5.57 5 8.75C5 12.5 10 17.5 10 17.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="10"
                        cy="8.75"
                        r="2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    {t('viewOnMap')}
                  </button>
                </div>

                <div className={styles.addressRow}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 14C8 14 12 10.4183 12 7C12 4.23858 10.2091 2 8 2C5.79086 2 4 4.23858 4 7C4 10.4183 8 14 8 14Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle cx="8" cy="7" r="1.5" fill="currentColor" />
                  </svg>
                  <span className={styles.address}>{branchAddress}</span>
                </div>

                {branch.contact_number && (
                  <button
                    className={styles.callButton}
                    onClick={() => handleCallClick(branch.contact_number!)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M14 11.5V13C14 13.5523 13.5523 14 13 14H12.5C6.14873 14 1 8.85127 1 2.5V2C1 1.44772 1.44772 1 2 1H3.5C3.77614 1 4 1.22386 4 1.5V4C4 4.27614 3.77614 4.5 3.5 4.5H2.5C2.5 7.81371 5.18629 10.5 8.5 10.5V9.5C8.5 9.22386 8.72386 9 9 9H11.5C11.7761 9 12 9.22386 12 9.5V11.5Z"
                        fill="currentColor"
                      />
                    </svg>
                    {branch.contact_number}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BranchesSection;
