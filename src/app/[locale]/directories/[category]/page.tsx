import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { categoryRepository } from '@/infrastructure/repositories/CategoryRepository';
import { tagRepository } from '@/infrastructure/repositories/TagRepository';
import { filterRepository } from '@/infrastructure/repositories/FilterRepository';
import BusinessListView from '@/presentation/components/BusinessListView/BusinessListView';
import { buildCanonicalUrl, buildPageTitle, buildPageDescription, shouldIndexPage } from '@/lib/seo';

// Force dynamic rendering to ensure fresh data on every request
export const dynamic = 'force-dynamic';

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
    const defaultCanonical = buildCanonicalUrl(baseUrl, locale, category, filters);

    // Check if this is a base category page (no filters applied)
    const hasFilters = Object.values(filters).some(v => v !== undefined);

    // For base category pages, prioritize backend SEO fields
    let title: string;
    let description: string;
    let ogTitle: string;
    let ogDescription: string;
    let canonical: string;
    let ogImage: string | undefined;

    if (!hasFilters && categoryData.seo) {
      // Use backend SEO fields for base category page
      title = categoryData.seo.meta_title || buildPageTitle(categoryData.name, filters, {
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

      description = categoryData.seo.meta_description || buildPageDescription(categoryData.name, filters, {
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

      ogTitle = categoryData.seo.og_title || title;
      ogDescription = categoryData.seo.og_description || description;
      ogImage = categoryData.seo.og_image;
      canonical = categoryData.seo.canonical_url || defaultCanonical;
    } else {
      // Use dynamic SEO for filtered pages
      title = buildPageTitle(categoryData.name, filters, {
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

      description = buildPageDescription(categoryData.name, filters, {
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

      ogTitle = title;
      ogDescription = description;
      canonical = defaultCanonical;
    }

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
        title: ogTitle,
        description: ogDescription,
        url: canonical,
        siteName: t('siteName'),
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

    // Parse filters from searchParams - collect ALL params except reserved ones
    const reservedParams = ['page', 'limit', 'sort', 'tag'];
    const dynamicFilters: Record<string, string> = {};

    Object.entries(searchParams).forEach(([key, value]) => {
      if (!reservedParams.includes(key) && value) {
        dynamicFilters[key] = value;
      }
    });

    const requestParams = {
      filters: Object.keys(dynamicFilters).length > 0 ? dynamicFilters : undefined,
      sort: (searchParams.sort as 'name' | 'rating' | 'views' | 'newest') || 'rating',
      page: searchParams.page ? parseInt(searchParams.page) : 1,
      limit: 20,
      tags: searchParams.tag ? [searchParams.tag] : undefined,
    };

    // Fetch businesses for this category
    const { businesses, total, page, limit, total_pages, has_more } = await categoryRepository.getBusinessesByCategory(
      category,
      requestParams,
      locale
    );

    // Fetch tags for this category
    const tags = await tagRepository.getTagsByCategory(category, locale);

    // Fetch dynamic filters for this category
    const filterDefinitions = await filterRepository.getFiltersByCategory(category, locale);

    return (
      <BusinessListView
        category={{
          title: categoryData.display_title,
          slug: categoryData.slug,
        }}
        businesses={businesses}
        tags={tags}
        selectedTag={searchParams.tag || null}
        filters={{
          filters: dynamicFilters,
          sort: requestParams.sort,
        }}
        dynamicFilters={filterDefinitions}
      />
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}
