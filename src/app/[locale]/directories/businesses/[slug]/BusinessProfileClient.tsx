'use client';

import { useState } from 'react';
import { Business, Branch, WorkingHours, FAQ, BusinessMedia, AvailableTabs } from '@/domain/entities/Business';
import {
  BusinessTabs,
  AboutTabContent,
  MediaTabContent,
  ReviewsTabContent,
} from './components';

interface BusinessProfileClientProps {
  business: Business;
  locale: string;
  availableTabs: AvailableTabs;
  branches?: Branch[];
  workingHours?: WorkingHours[];
  faqs?: FAQ[];
  media?: BusinessMedia[];
}

export default function BusinessProfileClient({
  business,
  locale,
  availableTabs,
  branches,
  workingHours,
  faqs,
  media,
}: BusinessProfileClientProps) {
  const [activeTab, setActiveTab] = useState<string>('about');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <AboutTabContent
            business={business}
            locale={locale}
            branches={branches}
            workingHours={workingHours}
            faqs={faqs}
          />
        );
      case 'media':
        return <MediaTabContent media={media || []} locale={locale} />;
      case 'reviews':
        return <ReviewsTabContent businessSlug={business.slug} locale={locale} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Tabs Navigation */}
      <BusinessTabs
        availableTabs={availableTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      {renderTabContent()}
    </>
  );
}
