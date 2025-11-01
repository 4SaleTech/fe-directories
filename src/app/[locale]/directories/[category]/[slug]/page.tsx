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
    const defaultCanonical = `${baseUrl}/${locale}/directories/${category}/${slug}`;

    // Prioritize SEO fields from backend
    const metaTitle = business.seo?.meta_title || `${businessName} | 4Sale`;
    const metaDescription = business.seo?.meta_description || description || `View ${businessName} business profile on 4Sale`;
    const ogTitle = business.seo?.og_title || metaTitle;
    const ogDescription = business.seo?.og_description || metaDescription;
    const ogImage = business.seo?.og_image || business.cover_image;
    const canonical = business.seo?.canonical_url || defaultCanonical;

    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical,
        languages: {
          ar: `${baseUrl}/ar/directories/${category}/${slug}`,
          en: `${baseUrl}/en/directories/${category}/${slug}`,
        },
      },
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: canonical,
        siteName: '4Sale',
        locale: locale === 'ar' ? 'ar_AR' : 'en_US',
        type: 'website',
        images: ogImage ? [{ url: ogImage }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        images: ogImage ? [ogImage] : [],
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
    // Fetch business data (now includes tabs array)
    const business = await businessRepository.getBusinessBySlug(category, slug, locale);

    // Increment view count (don't await to not block page render)
    businessRepository.incrementViews(slug).catch(() => {});

    // Check which tabs are enabled from the tabs array
    const tabs = business.tabs || [];
    const hasAboutTab = tabs.some(tab => tab.enabled && (tab.slug === 'about' || tab.content_type === 'about'));
    const hasMediaTab = tabs.some(tab => tab.enabled && (tab.slug === 'media' || tab.content_type === 'media'));

    // Fetch additional data in parallel based on enabled tabs
    const [aboutData, mediaData] = await Promise.all([
      hasAboutTab
        ? businessRepository.getAboutData(slug, locale).catch(() => ({
            branches: [],
            workingHours: [],
            faqs: [],
          }))
        : Promise.resolve({ branches: [], workingHours: [], faqs: [] }),
      hasMediaTab
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
      <>
        {/* Structured Data (Schema.org JSON-LD) */}
        {business.seo?.structured_data && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(business.seo.structured_data),
            }}
          />
        )}

        <div className={styles.page}>
          <div className={styles.container}>
            {/* Main Content */}
            <main className={styles.mainContent}>
              <BusinessProfileClient
                business={business}
                locale={locale}
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
      </>
    );
  } catch (error) {
    console.error('Error loading business profile:', error);
    notFound();
  }
}
