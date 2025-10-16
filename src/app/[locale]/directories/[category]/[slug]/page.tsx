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
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: BusinessProfilePageProps): Promise<Metadata> {
  const { locale, category, slug } = params;

  try {
    const business = await businessRepository.getBusinessBySlug(category, slug, locale);
    const businessName = locale === 'ar' ? business.name_ar : business.name;
    const description = locale === 'ar' ? business.about_ar : business.about;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const canonical = `${baseUrl}/${locale}/directories/${category}/${slug}`;

    return {
      title: `${businessName} | 4Sale`,
      description: description || `View ${businessName} business profile on 4Sale`,
      alternates: {
        canonical,
        languages: {
          ar: `${baseUrl}/ar/directories/${category}/${slug}`,
          en: `${baseUrl}/en/directories/${category}/${slug}`,
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
  const { locale, category, slug } = params;

  try {
    // Fetch business data first to get available_tabs
    const business = await businessRepository.getBusinessBySlug(category, slug, locale);

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

    // Determine if we need to fetch About tab data (branches, working hours, FAQs)
    const needsAboutData = available_tabs.has_branches || available_tabs.has_working_hours || available_tabs.has_faqs;

    // Fetch additional data in parallel based on available tabs
    const [aboutData, mediaData] = await Promise.all([
      needsAboutData
        ? businessRepository.getAboutData(slug, locale).catch(() => ({
            branches: [],
            workingHours: [],
            faqs: [],
          }))
        : Promise.resolve({ branches: [], workingHours: [], faqs: [] }),
      available_tabs.has_media
        ? businessRepository.getMedia(slug).catch(() => ({ media: [], total: 0 }))
        : Promise.resolve({ media: [], total: 0 }),
    ]);

    const { branches, workingHours: workingHoursData, faqs } = aboutData;

    // Pre-filter and sort FAQs on the server to prevent hydration issues
    const activeFaqs = faqs
      .filter((faq) => faq.is_active)
      .sort((a, b) => a.display_order - b.display_order);

    // Pre-sort working hours by day on the server to prevent hydration issues
    const sortedWorkingHours = [...workingHoursData].sort((a, b) => a.day - b.day);

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
              workingHours={sortedWorkingHours}
              faqs={activeFaqs}
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
