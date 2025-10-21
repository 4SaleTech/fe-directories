'use client';

import { BusinessTab } from '@/domain/entities/Business';
import styles from './BusinessTabs.module.scss';

interface BusinessTabsProps {
  tabs: BusinessTab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BusinessTabs = ({ tabs, activeTab, onTabChange }: BusinessTabsProps) => {
  // Filter only enabled tabs and sort by order
  const enabledTabs = tabs
    .filter(tab => tab.enabled)
    .sort((a, b) => a.order - b.order);

  const handleTabClick = (tabSlug: string) => {
    onTabChange(tabSlug);
  };

  return (
    <nav className={styles.tabsContainer}>
      <div className={styles.tabs}>
        {enabledTabs.map((tab) => (
          <button
            key={tab.slug}
            className={`${styles.tab} ${activeTab === tab.slug ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.slug)}
            aria-selected={activeTab === tab.slug}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.indicator} />
    </nav>
  );
};

export default BusinessTabs;
