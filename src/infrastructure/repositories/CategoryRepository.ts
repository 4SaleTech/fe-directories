import { apiClient } from '../api/client';
import { Category, CategoryWithSubcategories } from '@/domain/entities/Category';
import { Business } from '@/domain/entities/Business';

// Backend response type for businesses in a category
interface BusinessDTO {
  id: number;
  name: string;
  slug: string;
  about?: string;
  category_id: number;
  category_slug?: string;
  owner_id?: number;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  logo?: string;
  cover_image?: string;
  is_verified: boolean;
  is_featured: boolean;
  view_count: number;
  rating_avg: number;
  rating_count: number;
  tags?: string[];
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
    category_id: dto.category_id,
    category_slug: dto.category_slug,
    logo: dto.logo,
    cover_image: dto.cover_image,
    rating: dto.rating_avg,
    reviews_count: dto.rating_count,
    views_count: dto.view_count,
    is_verified: dto.is_verified,
    is_featured: dto.is_featured,
    is_open: true,
    whatsapp_number: dto.phone,
    contact_numbers: dto.phone,
    email: dto.email,
    website: dto.website,
    address: dto.address,
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
      verified?: boolean;
      featured?: boolean;
      min_rating?: number;
      sort?: 'name' | 'rating' | 'views' | 'newest';
      page?: number;
      limit?: number;
      tags?: string[];
    },
    locale: string = 'ar'
  ): Promise<{ businesses: Business[]; total: number; page: number; limit: number; has_more: boolean }> {
    const queryParams = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 20),
    });

    if (params.verified !== undefined) queryParams.append('verified', String(params.verified));
    if (params.featured !== undefined) queryParams.append('featured', String(params.featured));
    if (params.min_rating !== undefined) queryParams.append('min_rating', String(params.min_rating));
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.tags && params.tags.length > 0) queryParams.append('tags', params.tags.join(','));

    const response = await apiClient.get<{ data: { businesses: BusinessDTO[]; total: number; page: number; limit: number; has_more: boolean } }>(
      `/categories/${slug}/businesses?${queryParams}`,
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
}

export const categoryRepository = new CategoryRepository();
