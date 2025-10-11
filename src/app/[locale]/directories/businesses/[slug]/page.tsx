import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { businessRepository } from '@/infrastructure/repositories/BusinessRepository';
import {
  BusinessSidebar,
} from './components';
import BusinessProfileClient from './BusinessProfileClient';
import styles from './page.module.scss';

interface BusinessProfilePageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: BusinessProfilePageProps): Promise<Metadata> {
  const { locale, slug } = params;

  try {
    const business = await businessRepository.getBusinessBySlug(slug, locale);
    const businessName = locale === 'ar' ? business.name_ar : business.name;
    const description = locale === 'ar' ? business.about_ar : business.about;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const canonical = `${baseUrl}/${locale}/directories/businesses/${slug}`;

    return {
      title: `${businessName} | 4Sale`,
      description: description || `View ${businessName} business profile on 4Sale`,
      alternates: {
        canonical,
        languages: {
          ar: `${baseUrl}/ar/directories/businesses/${slug}`,
          en: `${baseUrl}/en/directories/businesses/${slug}`,
        },
      },
      openGraph: {
        title: `${businessName} | 4Sale`,
        description: description || `View ${businessName} business profile on 4Sale`,
        url: canonical,
        siteName: '4Sale',
        locale: locale === 'ar' ? 'ar_AR' : 'en_US',
        type: 'website',
        images: business.cover_image ? [{ url: business.cover_image }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Business Not Found | 4Sale',
      description: 'The requested business could not be found.',
    };
  }
}

export default async function BusinessProfilePage({ params }: BusinessProfilePageProps) {
  const { locale, slug } = params;

  try {
    // Fetch business data first to get available_tabs
    const business = await businessRepository.getBusinessBySlug(slug, locale);

    // Increment view count (don't await to not block page render)
    businessRepository.incrementViews(slug).catch(() => {});

    // Use available_tabs from API or default values
    const available_tabs = business.available_tabs || {
      has_branches: false,
      has_working_hours: false,
      has_faqs: false,
      has_services: false,
      has_media: false,
      has_reviews: false,
    };

    // Fetch additional data in parallel based on available tabs
    const [workingHoursData, faqs, branches, mediaData] = await Promise.all([
      available_tabs.has_working_hours
        ? businessRepository.getWorkingHours(slug).catch(() => [])
        : Promise.resolve([]),
      available_tabs.has_faqs
        ? businessRepository.getFAQs(slug, locale).catch(() => [])
        : Promise.resolve([]),
      available_tabs.has_branches
        ? businessRepository.getBranches(slug, locale).catch(() => [])
        : Promise.resolve([]),
      available_tabs.has_media
        ? businessRepository.getMedia(slug).catch(() => ({ media: [], total: 0 }))
        : Promise.resolve({ media: [], total: 0 }),
    ]);

    return (
      <div className={styles.page}>
        <div className={styles.container}>
          {/* Main Content */}
          <main className={styles.mainContent}>
            <BusinessProfileClient
              business={business}
              locale={locale}
              availableTabs={available_tabs}
              branches={branches}
              workingHours={workingHoursData}
              faqs={faqs}
              media={mediaData.media}
            />
          </main>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <BusinessSidebar business={business} locale={locale} />
          </aside>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading business profile:', error);
    notFound();
  }
}
