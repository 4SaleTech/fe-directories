'use client';

import { useState } from 'react';
import { Business, Branch, WorkingHours, FAQ, BusinessMedia, BusinessTab } from '@/domain/entities/Business';
import {
  BusinessTabs,
  AboutTabContent,
  ServicesTabContent,
  MediaTabContent,
  ReviewsTabContent,
} from './components';

interface BusinessProfileClientProps {
  business: Business;
  locale: string;
  branches?: Branch[];
  workingHours?: WorkingHours[];
  faqs?: FAQ[];
  media?: BusinessMedia[];
}

export default function BusinessProfileClient({
  business,
  locale,
  branches,
  workingHours,
  faqs,
  media,
}: BusinessProfileClientProps) {
  // Use tabs from business data, default to 'about' tab
  const tabs: BusinessTab[] = business.tabs || [];
  const defaultTab = tabs.find(tab => tab.enabled)?.slug || 'about';
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

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
      case 'services':
        return <ServicesTabContent businessSlug={business.slug} locale={locale} />;
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
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      {renderTabContent()}
    </>
  );
}
