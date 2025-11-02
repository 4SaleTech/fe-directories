import { apiClient } from '../api/client';
import { Category, CategoryWithSubcategories } from '@/domain/entities/Category';
import { Business } from '@/domain/entities/Business';

// Backend response type for businesses in a category
interface BusinessDTO {
  id: number;
  name: string;
  slug: string;
  about?: string;
  category_id?: number;
  category_slug?: string;
  user_id?: number;
  logo?: string;
  cover_image?: string;
  contact_info?: {
    contact_numbers?: string[];
    whatsapp?: string[];
    email?: string;
    website?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
  };
  attributes?: Record<string, any>;
  view_count: number;
  rating: {
    average: number;
    count: number;
  };
  status?: string;
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
    type: string;
    display_order: number;
    usage_count: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
  display_title?: string;
  display_description?: string;
  created_at: string;
  updated_at: string;
}

// Map backend DTO to frontend entity
function mapBusinessDTO(dto: BusinessDTO, locale: string): Business {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    name_ar: dto.name,
    about: dto.about,
    about_ar: dto.about,
    category_id: dto.category_id || 0,
    category_slug: dto.category_slug,
    logo: dto.logo,
    cover_image: dto.cover_image,
    rating: {
      average: dto.rating.average,
      count: dto.rating.count,
    },
    views_count: dto.view_count,
    attributes: dto.attributes,
    is_open: true,
    contact_info: {
      contact_numbers: dto.contact_info?.contact_numbers || [],
      whatsapp: dto.contact_info?.whatsapp || [],
      email: dto.contact_info?.email || '',
      website: dto.contact_info?.website || ''
    },
    location: dto.location,
    tags: dto.tags,
    display_title: dto.display_title || dto.name,
    display_description: dto.display_description || dto.about || '',
  };
}

export class CategoryRepository {
  async getAllCategories(locale: string = 'ar'): Promise<Category[]> {
    const response = await apiClient.get<{ data: { categories: Category[]; total: number } }>(
      '/categories',
      { headers: { 'X-Language': locale } }
    );
    return response.data.categories;
  }

  async getCategoryBySlug(slug: string, locale: string = 'ar'): Promise<Category> {
    const response = await apiClient.get<{ data: { category: Category } }>(
      `/categories/${slug}`,
      { headers: { 'X-Language': locale } }
    );
    return response.data.category;
  }

  async getBusinessesByCategory(
    slug: string,
    params: {
      filters?: Record<string, string>;
      sort?: 'name' | 'rating' | 'views' | 'newest';
      page?: number;
      limit?: number;
      tags?: string[];
    },
    locale: string = 'ar'
  ): Promise<{ businesses: Business[]; total: number; page: number; limit: number; total_pages: number; has_more: boolean }> {
    const queryParams = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 20),
    });

    // Add dynamic filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });
    }

    if (params.sort) queryParams.append('sort', params.sort);
    if (params.tags && params.tags.length > 0) queryParams.append('tags', params.tags.join(','));

    const response = await apiClient.get<{ data: { businesses: BusinessDTO[]; total: number; page: number; limit: number; total_pages: number; has_more: boolean } }>(
      `/categories/${slug}/businesses?${queryParams}`,
      { headers: { 'X-Language': locale } }
    );

    return {
      businesses: response.data.businesses.map(dto => mapBusinessDTO(dto, locale)),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      total_pages: response.data.total_pages,
      has_more: response.data.has_more,
    };
  }
}

export const categoryRepository = new CategoryRepository();
