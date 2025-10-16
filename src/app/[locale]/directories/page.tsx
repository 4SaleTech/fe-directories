import { getTranslations } from 'next-intl/server';
import { categoryRepository } from '@/infrastructure/repositories/CategoryRepository';
import { businessRepository } from '@/infrastructure/repositories/BusinessRepository';
import { sectionRepository } from '@/infrastructure/repositories/SectionRepository';
import HeroBanner from '@/presentation/components/HeroBanner/HeroBanner';
import { SearchBar } from '@/presentation/components/SearchBar';
import CategoryGrid from '@/presentation/components/CategoryGrid/CategoryGrid';
import { FeaturedSection } from '@/presentation/components/FeaturedSection';
import styles from './page.module.scss';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface DirectoriesPageProps {
  params: {
    locale: string;
  };
}

export default async function DirectoriesPage({ params }: DirectoriesPageProps) {
  const { locale } = params;

  // Fetch all categories for horizontal scrollable row
  const categories = await categoryRepository.getAllCategories(locale);

  // Fetch dynamic sections from the API
  const sections = await sectionRepository.getAllSections(locale);

  return (
    <div className={styles.homePage}>
      {/* Search Bar */}
      <section className={styles.searchSection}>
        <SearchBar locale={locale} placeholder={locale === 'ar' ? 'ابحث عن أي شئ' : 'Search for anything'} />
      </section>

      {/* Category Grid */}
      <section className={styles.categorySection}>
        <CategoryGrid categories={categories} locale={locale} />
      </section>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Dynamic Sections from API */}
      <section className={styles.featuredSections}>
        {sections.map((section) => {
          // Only render sections that have businesses
          if (!section.businesses || section.businesses.length === 0) {
            return null;
          }

          // Determine the title based on locale
          const title = locale === 'ar' && section.title_ar ? section.title_ar : section.title;

          // Get CTA text from new structure
          const ctaText = section.cta.title;

          // Build query parameters from section CTA filters and tags
          const queryParams = new URLSearchParams();

          // Add tag filter (only first tag, as category page supports single tag)
          if (section.cta.tags && section.cta.tags.length > 0) {
            queryParams.set('tag', section.cta.tags[0]);
          }

          // Add filter criteria dynamically
          if (section.cta.filters) {
            Object.entries(section.cta.filters).forEach(([key, value]) => {
              if (value) {
                queryParams.set(key, value);
              }
            });
          }

          // Generate view all link with query params
          // Use category slug from CTA if available, otherwise link to home
          const categorySlug = section.cta.category_slug;

          const baseUrl = categorySlug
            ? `/${locale}/directories/${categorySlug}`
            : `/${locale}/directories`;

          const queryString = queryParams.toString();
          const viewAllLink = queryString ? `${baseUrl}?${queryString}` : baseUrl;

          return (
            <FeaturedSection
              key={section.id}
              title={title}
              businesses={section.businesses}
              viewAllLink={viewAllLink}
              locale={locale}
              backgroundColor={section.background_color}
              ctaText={ctaText}
            />
          );
        })}
      </section>
    </div>
  );
}
