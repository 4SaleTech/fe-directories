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
  const tabs: { key: TabKey; labelKey: string; available: boolean }[] = [
    { key: 'about', labelKey: 'about', available: true }, // Always show About
    { key: 'media', labelKey: 'media', available: availableTabs.has_media },
    { key: 'reviews', labelKey: 'reviews', available: availableTabs.has_reviews },
  ];

  const handleTabClick = (tabKey: TabKey) => {
    onTabChange(tabKey);
  };

  const visibleTabs = tabs.filter((tab) => tab.available);

  return (
    <nav className={styles.tabsContainer}>
      <div className={styles.tabs}>
        {visibleTabs.map((tab) => (
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
