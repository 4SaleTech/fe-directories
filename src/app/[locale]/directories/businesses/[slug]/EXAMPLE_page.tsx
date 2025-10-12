/**
 * EXAMPLE Business Profile Page
 *
 * This is an example implementation showing how to use all the business profile components.
 * Copy this structure to your actual page.tsx file and integrate with your data fetching logic.
 *
 * Location: /src/app/[locale]/directories/businesses/[slug]/page.tsx
 */

'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  BusinessSidebar,
  BusinessTabs,
  BranchesSection,
  WorkingHoursSection,
  FAQSection,
} from './components';
import styles from './page.module.scss';

// Example: Define your page props
interface BusinessProfilePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default function BusinessProfilePage({ params }: BusinessProfilePageProps) {
  const { locale, slug } = params;
  const [activeTab, setActiveTab] = useState('about');

  // TODO: Replace with your actual data fetching logic
  // Example using a repository pattern:
  // const businessRepository = new BusinessRepository();
  // const business = await businessRepository.getBySlug(slug);
  // const branches = await businessRepository.getBranches(business.id);
  // const workingHours = await businessRepository.getWorkingHours(business.id);
  // const faqs = await businessRepository.getFAQs(business.id);

  // Example mock data structure (replace with actual data)
  const business = {
    id: 1,
    slug: slug,
    name: 'Sample Business',
    name_ar: 'عمل نموذجي',
    about: 'This is a sample business description in English.',
    about_ar: 'هذا وصف تجاري نموذجي باللغة العربية.',
    category_id: 1,
    logo: '/images/business-logo.jpg',
    cover_image: '/images/business-cover.jpg',
    rating: 4.5,
    reviews_count: 250,
    views_count: 1500,
    is_verified: true,
    is_featured: true,
    is_open: true,
    contact_numbers: '+96599999999',
    whatsapp_number: '+96599999999',
    email: 'contact@business.com',
    website: 'https://www.business.com',
    social_media: {
      facebook: 'https://facebook.com/business',
      instagram: 'https://instagram.com/business',
      twitter: 'https://twitter.com/business',
    },
    address: '123 Main Street, City',
    available_tabs: {
      has_branches: true,
      has_working_hours: true,
      has_faqs: true,
      has_services: true,
      has_media: true,
      has_reviews: true,
    },
  };

  const branches = [
    {
      id: 1,
      name: 'Main Branch',
      name_ar: 'الفرع الرئيسي',
      address: '123 Main Street, City',
      address_ar: '123 الشارع الرئيسي، المدينة',
      latitude: 29.3759,
      longitude: 47.9774,
      contact_number: '+96599999999',
    },
  ];

  const workingHours = [
    { id: 1, business_id: 1, day: 0, open_time: '09:00', close_time: '22:00', is_closed: false, created_at: '', updated_at: '' },
    { id: 2, business_id: 1, day: 1, open_time: '09:00', close_time: '22:00', is_closed: false, created_at: '', updated_at: '' },
    { id: 3, business_id: 1, day: 2, open_time: '09:00', close_time: '22:00', is_closed: false, created_at: '', updated_at: '' },
    { id: 4, business_id: 1, day: 3, open_time: '09:00', close_time: '22:00', is_closed: false, created_at: '', updated_at: '' },
    { id: 5, business_id: 1, day: 4, open_time: '09:00', close_time: '22:00', is_closed: false, created_at: '', updated_at: '' },
    { id: 6, business_id: 1, day: 5, open_time: '09:00', close_time: '22:00', is_closed: true, created_at: '', updated_at: '' },
    { id: 7, business_id: 1, day: 6, open_time: '09:00', close_time: '22:00', is_closed: false, created_at: '', updated_at: '' },
  ];

  const faqs = [
    {
      id: 1,
      business_id: 1,
      question: 'What are your payment methods?',
      question_ar: 'ما هي طرق الدفع المتاحة؟',
      answer: 'We accept cash, credit cards, and online payments.',
      answer_ar: 'نقبل الدفع نقداً وبطاقات الائتمان والمدفوعات الإلكترونية.',
      display_order: 1,
      is_active: true,
      created_at: '',
      updated_at: '',
    },
    {
      id: 2,
      business_id: 1,
      question: 'Do you offer delivery services?',
      question_ar: 'هل تقدمون خدمة التوصيل؟',
      answer: 'Yes, we offer delivery within the city limits.',
      answer_ar: 'نعم، نقدم خدمة التوصيل داخل حدود المدينة.',
      display_order: 2,
      is_active: true,
      created_at: '',
      updated_at: '',
    },
  ];

  return (
    <div className={styles.businessProfile}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Main Content - Left Column */}
          <main className={styles.mainContent}>
            {/* Tabs Navigation */}
            <BusinessTabs
              availableTabs={business.available_tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* About Section */}
            <section id="about" className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {locale === 'ar' ? 'حول' : 'About'}
              </h2>
              <div className={styles.aboutContent}>
                <p>{locale === 'ar' ? business.about_ar : business.about}</p>
              </div>
            </section>

            {/* Services Section (if available) */}
            {business.available_tabs.has_services && (
              <section id="services" className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {locale === 'ar' ? 'الخدمات' : 'Services'}
                </h2>
                {/* TODO: Add ServicesSection component */}
                <p>Services content goes here...</p>
              </section>
            )}

            {/* Branches Section */}
            {business.available_tabs.has_branches && (
              <BranchesSection branches={branches} locale={locale} />
            )}

            {/* Working Hours Section */}
            {business.available_tabs.has_working_hours && (
              <WorkingHoursSection workingHours={workingHours} locale={locale} />
            )}

            {/* Reviews Section (if available) */}
            {business.available_tabs.has_reviews && (
              <section id="reviews" className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {locale === 'ar' ? 'التقييمات' : 'Reviews'}
                </h2>
                {/* TODO: Add ReviewsSection component */}
                <p>Reviews content goes here...</p>
              </section>
            )}

            {/* Media Section (if available) */}
            {business.available_tabs.has_media && (
              <section id="media" className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  {locale === 'ar' ? 'الوسائط' : 'Media'}
                </h2>
                {/* TODO: Add MediaSection component */}
                <p>Media gallery goes here...</p>
              </section>
            )}

            {/* FAQs Section */}
            {business.available_tabs.has_faqs && (
              <FAQSection faqs={faqs} locale={locale} />
            )}
          </main>

          {/* Sidebar - Right Column */}
          <aside className={styles.sidebar}>
            <BusinessSidebar business={business} locale={locale} />
          </aside>
        </div>
      </div>
    </div>
  );
}

// Example metadata generation (optional)
export async function generateMetadata({ params }: BusinessProfilePageProps) {
  const { slug } = params;

  // TODO: Fetch business data for metadata
  // const business = await getBusinessBySlug(slug);

  return {
    title: `Business Name | 4Sale Directories`,
    description: 'Business description...',
    // Add Open Graph, Twitter cards, etc.
  };
}
