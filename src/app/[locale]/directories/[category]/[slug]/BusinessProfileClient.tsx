'use client';

import { useState, useEffect } from 'react';
import { Business, Branch, WorkingHours, FAQ, BusinessMedia, BusinessTab } from '@/domain/entities/Business';
import { businessRepository } from '@/infrastructure/repositories/BusinessRepository';
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
  media: initialMedia,
}: BusinessProfileClientProps) {
  // Use tabs from business data, default to 'about' tab
  const tabs: BusinessTab[] = business.tabs || [];
  const defaultTab = tabs.find(tab => tab.enabled)?.slug || 'about';
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [mediaData, setMediaData] = useState<BusinessMedia[]>(initialMedia || []);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  // Fetch media when tab changes to media or menu tab
  useEffect(() => {
    const fetchMediaForTab = async () => {
      if (activeTab === 'media' || activeTab === 'menu') {
        setIsLoadingMedia(true);
        try {
          const category = activeTab === 'menu' ? 'menu' : 'gallery';
          const result = await businessRepository.getMedia(business.slug, category);
          setMediaData(result.media);
        } catch (error) {
          console.error('Failed to fetch media:', error);
          setMediaData([]);
        } finally {
          setIsLoadingMedia(false);
        }
      }
    };

    fetchMediaForTab();
  }, [activeTab, business.slug]);

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
      case 'menu':
        return <MediaTabContent media={isLoadingMedia ? [] : mediaData} locale={locale} />;
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
