import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { categoryRepository } from '@/infrastructure/repositories/CategoryRepository';
import { tagRepository } from '@/infrastructure/repositories/TagRepository';
import BusinessListView from '@/presentation/components/BusinessListView/BusinessListView';
import { buildCanonicalUrl, buildPageTitle, buildPageDescription, shouldIndexPage } from '@/lib/seo';

interface CategoryPageProps {
  params: {
    locale: string;
    category: string;
  };
  searchParams: {
    tag?: string;
    verified?: string;
    featured?: string;
    rating?: string;
    sort?: string;
    page?: string;
  };
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { locale, category } = params;

  try {
    const categoryData = await categoryRepository.getCategoryBySlug(category, locale);
    const t = await getTranslations({ locale, namespace: 'seo' });

    // Get tag name if tag filter is present
    let tagName: string | undefined;
    if (searchParams.tag) {
      const tag = await tagRepository.getTagBySlug(searchParams.tag, locale);
      tagName = tag?.name;
    }

    // Build SEO metadata
    const filters = {
      tag: searchParams.tag,
      verified: searchParams.verified,
      featured: searchParams.featured,
      rating: searchParams.rating,
      sort: searchParams.sort,
    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const canonical = buildCanonicalUrl(baseUrl, locale, category, filters);
    const title = buildPageTitle(categoryData.name, filters, {
      verified: t('verified'),
      starsRating: t('starsRating'),
      siteName: t('siteName'),
      discover: t('discover'),
      best: t('best'),
      verifiedText: t('verifiedText'),
      withRating: t('withRating'),
      results: t('results'),
      on4Sale: t('on4Sale'),
    }, tagName);

    const description = buildPageDescription(categoryData.name, filters, {
      verified: t('verified'),
      starsRating: t('starsRating'),
      siteName: t('siteName'),
      discover: t('discover'),
      best: t('best'),
      verifiedText: t('verifiedText'),
      withRating: t('withRating'),
      results: t('results'),
      on4Sale: t('on4Sale'),
    }, tagName);

    const shouldIndex = shouldIndexPage(filters);

    return {
      title,
      description,
      alternates: {
        canonical,
        languages: {
          ar: `${baseUrl}/ar/directories/${category}`,
          en: `${baseUrl}/en/directories/${category}`,
        },
      },
      robots: shouldIndex ? 'index, follow' : 'noindex, follow',
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: t('siteName'),
        locale: locale === 'ar' ? 'ar_AR' : 'en_US',
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { locale, category } = params;

  try {
    // Fetch category data
    const categoryData = await categoryRepository.getCategoryBySlug(category, locale);

    // Parse filters from searchParams
    const filters = {
      verified: searchParams.verified === 'true' ? true : undefined,
      featured: searchParams.featured === 'true' ? true : undefined,
      min_rating: searchParams.rating ? parseFloat(searchParams.rating) : undefined,
      sort: (searchParams.sort as 'name' | 'rating' | 'views' | 'newest') || 'rating',
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: 20,
      tags: searchParams.tag ? [searchParams.tag] : undefined,
    };

    // Fetch businesses for this category
    const { businesses, total, page, limit, has_more } = await categoryRepository.getBusinessesByCategory(
      category,
      filters,
      locale
    );

    // Fetch tags for this category
    const tags = await tagRepository.getTagsByCategory(category, locale);

    return (
      <BusinessListView
        category={{
          title: categoryData.name,
          slug: categoryData.slug,
        }}
        businesses={businesses}
        tags={tags}
        selectedTag={searchParams.tag || null}
        filters={{
          verified: filters.verified,
          featured: filters.featured,
          rating: filters.min_rating,
          sort: filters.sort,
        }}
      />
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}
