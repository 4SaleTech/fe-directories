/**
 * SEO utilities for building canonical URLs and determining indexability
 */

interface FilterParams {
  tag?: string;
  verified?: string;
  featured?: string;
  rating?: string;
  sort?: string;
}

interface SEOTranslations {
  verified: string;
  starsRating: string;
  siteName: string;
  discover: string;
  best: string;
  verifiedText: string;
  withRating: string;
  results: string;
  on4Sale: string;
}

/**
 * Builds a canonical URL by including only SEO-valuable parameters
 * Rules:
 * - Always include: locale, tag, verified if true, rating if >= 4
 * - Never include: sort, featured, rating < 4
 */
export function buildCanonicalUrl(
  baseUrl: string,
  locale: string,
  category: string,
  filters: FilterParams
): string {
  const canonical = `${baseUrl}/${locale}/directories/${category}`;
  const params = new URLSearchParams();

  // Include tag (high SEO value)
  if (filters.tag) {
    params.append('tag', filters.tag);
  }

  // Include verified (medium-high SEO value)
  if (filters.verified === 'true') {
    params.append('verified', 'true');
  }

  // Only include high ratings (4+)
  if (filters.rating && parseFloat(filters.rating) >= 4) {
    params.append('rating', filters.rating);
  }

  // Never include: sort (low SEO value), featured (promotional)

  const queryString = params.toString();
  return queryString ? `${canonical}?${queryString}` : canonical;
}

/**
 * Determines if a page should be indexed by search engines
 * Low-value combinations should have noindex
 */
export function shouldIndexPage(filters: FilterParams): boolean {
  // Only sort parameter = don't index (just reordering)
  if (filters.sort && !filters.tag && !filters.verified && !filters.rating) {
    return false;
  }

  // Only featured = don't index (promotional)
  if (filters.featured && !filters.tag && !filters.verified && !filters.rating) {
    return false;
  }

  // Low ratings without other filters = don't index
  if (filters.rating && parseFloat(filters.rating) < 4 && !filters.tag && !filters.verified) {
    return false;
  }

  // All other cases = index
  return true;
}

/**
 * Builds a dynamic page title based on active filters
 */
export function buildPageTitle(
  categoryName: string,
  filters: FilterParams,
  t: SEOTranslations,
  tagName?: string
): string {
  const parts: string[] = [];

  // Add tag name if present
  if (tagName) {
    parts.push(tagName);
  }

  // Add verified badge
  if (filters.verified === 'true') {
    parts.push(t.verified);
  }

  // Add rating filter
  if (filters.rating && parseFloat(filters.rating) >= 4) {
    const rating = parseFloat(filters.rating);
    parts.push(t.starsRating.replace('{rating}', rating.toString()));
  }

  // Add category
  parts.push(categoryName);

  // Build title
  if (parts.length > 1) {
    return `${parts.join(' - ')} | ${t.siteName}`;
  }

  return `${categoryName} | ${t.siteName}`;
}

/**
 * Builds a dynamic meta description based on active filters
 */
export function buildPageDescription(
  categoryName: string,
  filters: FilterParams,
  t: SEOTranslations,
  tagName?: string,
  totalResults?: number
): string {
  const parts: string[] = [t.discover];

  // Add tag context
  if (tagName) {
    parts.push(`${t.best} ${tagName}`);
  } else {
    parts.push(`${t.best} ${categoryName}`);
  }

  // Add verified context
  if (filters.verified === 'true') {
    parts.push(t.verifiedText);
  }

  // Add rating context
  if (filters.rating && parseFloat(filters.rating) >= 4) {
    const rating = parseFloat(filters.rating);
    parts.push(t.withRating.replace('{rating}', rating.toString()));
  }

  // Add results count
  if (totalResults !== undefined) {
    parts.push(`- ${t.results.replace('{count}', totalResults.toString())}`);
  }

  parts.push(t.on4Sale);

  return parts.join(' ');
}
