import { getTranslations } from 'next-intl/server';
import { categoryRepository } from '@/infrastructure/repositories/CategoryRepository';
import { businessRepository } from '@/infrastructure/repositories/BusinessRepository';
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

  // Fetch categories for the grid (limit to 8 for 2 rows of 4)
  const allCategories = await categoryRepository.getAllCategories(locale);
  const categories = allCategories.slice(0, 8);

  // Fetch top 5 businesses for each category (dynamic sections)
  const categorySections = await Promise.all(
    allCategories.map(async (category) => {
      const response = await categoryRepository.getBusinessesByCategory(
        category.slug,
        { limit: 5, sort: 'rating' },
        locale
      );
      return { category, businesses: response.businesses };
    })
  );

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

      {/* Dynamic Category Sections */}
      <section className={styles.featuredSections}>
        {categorySections.map(({ category, businesses }) =>
          businesses.length > 0 ? (
            <FeaturedSection
              key={category.id}
              title={locale === 'ar' ? `الأعلى تقييماً في ${category.name}` : `Top Rated in ${category.name}`}
              businesses={businesses}
              viewAllLink={`/${locale}/directories/${category.slug}`}
              locale={locale}
            />
          ) : null
        )}
      </section>
    </div>
  );
}
