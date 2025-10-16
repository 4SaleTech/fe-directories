'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AvailableTabs } from '@/domain/entities/Business';
import styles from './BusinessTabs.module.scss';

interface BusinessTabsProps {
  availableTabs: AvailableTabs;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

type TabKey = 'about' | 'media' | 'reviews';

const BusinessTabs = ({ availableTabs, activeTab, onTabChange }: BusinessTabsProps) => {
  const t = useTranslations('business');

  // Only show About, Media, and Reviews as top-level tabs
  // Tabs are pre-filtered on the server to prevent hydration issues
  const tabs: { key: TabKey; labelKey: string }[] = [
    { key: 'about', labelKey: 'about' }, // Always show About
    ...(availableTabs.has_media ? [{ key: 'media' as TabKey, labelKey: 'media' }] : []),
    ...(availableTabs.has_reviews ? [{ key: 'reviews' as TabKey, labelKey: 'reviews' }] : []),
  ];

  const handleTabClick = (tabKey: TabKey) => {
    onTabChange(tabKey);
  };

  return (
    <nav className={styles.tabsContainer}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.key)}
            aria-selected={activeTab === tab.key}
            role="tab"
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>
      <div className={styles.indicator} />
    </nav>
  );
};

export default BusinessTabs;
