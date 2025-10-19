import { apiClient } from '../api/client';
import { Business, Review, WorkingHours, Branch, FAQ, BusinessMedia } from '@/domain/entities/Business';
import { ForSaleService } from '@/domain/entities/ForSale';

// Backend response type (single language based on X-Language header)
interface BusinessDTO {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  category_slug?: string;
  about?: string;
  logo?: string;
  cover_image?: string;
  ad_image?: string;
  contact_info?: any;
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
  attributes?: Record<string, string>;
  view_count: number;
  rating: {
    average: number;
    count: number;
  };
  status: string;
  tags?: any[];
  available_tabs?: {
    has_branches: boolean;
    has_working_hours: boolean;
    has_faqs: boolean;
    has_services: boolean;
    has_media: boolean;
    has_reviews: boolean;
  };
  created_at: string;
  updated_at: string;
}

// Map backend DTO to frontend entity
function mapBusinessDTO(dto: BusinessDTO, locale: string): Business {
  // Extract contact info
  const contactInfo = dto.contact_info || {};
  const phone = contactInfo.phone || contactInfo.whatsapp;

  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    name_ar: dto.name,
    about: dto.about,
    about_ar: dto.about,
    category_id: 0, // Not provided in new API, set to 0 for compatibility
    category_slug: dto.category_slug,
    logo: dto.logo,
    cover_image: dto.cover_image,
    rating: dto.rating,
    views_count: dto.view_count,
    attributes: dto.attributes,
    is_open: true, // Would need to calculate from working hours
    whatsapp_number: phone,
    contact_numbers: phone,
    email: contactInfo.email,
    website: contactInfo.website,
    address: contactInfo.address,
    location: dto.location,
    social_media: dto.social_media,
    tags: dto.tags,
    available_tabs: dto.available_tabs,
  };
}

export class BusinessRepository {
  async getBusinessBySlug(categorySlug: string, businessSlug: string, locale: string = 'ar'): Promise<Business> {
    const response = await apiClient.get<{ data: BusinessDTO }>(
      `/categories/${categorySlug}/${businessSlug}`,
      {
        headers: { 'Accept-Language': locale },
      }
    );
    return mapBusinessDTO(response.data, locale);
  }

  async getAllBusinesses(
    params: {
      page?: number;
      limit?: number;
      featured?: boolean;
    },
    locale: string = 'ar'
  ): Promise<{ businesses: Business[]; total: number; page: number; limit: number; has_more: boolean }> {
    const queryParams = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 20),
    });

    const response = await apiClient.get<{ data: { businesses: BusinessDTO[]; total: number; page: number; limit: number; has_more: boolean } }>(
      `/search/businesses?${queryParams}`,
      { headers: { 'X-Language': locale } }
    );

    return {
      businesses: response.data.businesses.map(dto => mapBusinessDTO(dto, locale)),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      has_more: response.data.has_more,
    };
  }

  async searchBusinesses(
    query: string,
    filters?: {
      category?: string;
      min_rating?: number;
      verified_only?: boolean;
      sort?: 'relevance' | 'rating' | 'distance' | 'created_at';
      page?: number;
      limit?: number;
    },
    locale: string = 'ar'
  ): Promise<{ businesses: Business[]; total: number }> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.min_rating) params.append('min_rating', String(filters.min_rating));
    if (filters?.verified_only) params.append('verified_only', String(filters.verified_only));
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));

    const response = await apiClient.get<{ data: { businesses: BusinessDTO[]; total: number; page: number; limit: number } }>(
      `/search/businesses?${params}`,
      { headers: { 'X-Language': locale } }
    );

    return {
      businesses: response.data.businesses.map(dto => mapBusinessDTO(dto, locale)),
      total: response.data.total,
    };
  }

  async getWorkingHours(slug: string): Promise<WorkingHours[]> {
    const response = await apiClient.get<{ data: { working_hours: WorkingHours[]; is_open: boolean; status_text: string } }>(`/directories/businesses/${slug}/working-hours`);
    return response.data?.working_hours || [];
  }

  async getServices(slug: string, locale: string = 'ar'): Promise<ForSaleService[]> {
    const response = await apiClient.get<{ data: { services: ForSaleService[]; total: number } }>(
      `/directories/businesses/${slug}/services`,
      { headers: { 'X-Language': locale } }
    );
    return response.data?.services || [];
  }

  async getReviews(
    slug: string,
    params: { page?: number; limit?: number }
  ): Promise<{ reviews: Review[]; total: number; page: number; limit: number; has_more: boolean }> {
    const queryParams = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 20),
    });

    const response = await apiClient.get<{ data: { reviews: Review[]; total: number; page: number; limit: number; has_more: boolean } }>(
      `/directories/businesses/${slug}/reviews?${queryParams}`
    );

    // Ensure we always return a valid structure even if API returns null/undefined
    return {
      reviews: response.data?.reviews || [],
      total: response.data?.total || 0,
      page: response.data?.page || params.page || 1,
      limit: response.data?.limit || params.limit || 20,
      has_more: response.data?.has_more || false,
    };
  }

  async incrementViews(slug: string): Promise<void> {
    await apiClient.post(`/directories/businesses/${slug}/increment-views`);
  }

  async getFAQs(slug: string, locale: string = 'ar'): Promise<FAQ[]> {
    const response = await apiClient.get<{ data: { faqs: FAQ[]; total: number } }>(
      `/directories/businesses/${slug}/faqs`,
      { headers: { 'X-Language': locale } }
    );
    return response.data?.faqs || [];
  }

  async getBranches(slug: string, locale: string = 'ar'): Promise<Branch[]> {
    const response = await apiClient.get<{ data: Branch[] }>(
      `/directories/businesses/${slug}/branches`,
      { headers: { 'X-Language': locale } }
    );
    return response.data || [];
  }

  async getMedia(slug: string): Promise<{ media: BusinessMedia[]; total: number }> {
    const response = await apiClient.get<{ data: { media: BusinessMedia[]; total: number } }>(
      `/directories/businesses/${slug}/media`
    );
    return response.data || { media: [], total: 0 };
  }

  async getAboutData(slug: string, locale: string = 'ar'): Promise<{
    branches: Branch[];
    workingHours: WorkingHours[];
    faqs: FAQ[];
    isOpen?: boolean;
    statusText?: string;
  }> {
    const response = await apiClient.get<{
      data: {
        branches: Branch[];
        working_hours: {
          hours: WorkingHours[];
          is_open: boolean;
          status_text: string;
        };
        faqs: FAQ[];
      };
    }>(
      `/directories/businesses/${slug}/about`,
      { headers: { 'Accept-Language': locale } }
    );

    return {
      branches: response.data?.branches || [],
      workingHours: response.data?.working_hours?.hours || [],
      faqs: response.data?.faqs || [],
      isOpen: response.data?.working_hours?.is_open,
      statusText: response.data?.working_hours?.status_text,
    };
  }
}

export const businessRepository = new BusinessRepository();
