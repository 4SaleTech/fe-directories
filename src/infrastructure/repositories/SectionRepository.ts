import { apiClient } from '../api/client';
import { Section, SectionsResponse } from '@/domain/entities/Section';
import { Business } from '@/domain/entities/Business';

// Backend response type (from API)
interface BusinessDTO {
  id: number;
  name: string;
  slug: string;
  about?: string;
  category_id: number;
  category_slug?: string;
  logo?: string;
  cover_image?: string;
  attributes?: Record<string, string>;
  view_count: number;
  rating: {
    average: number;
    count: number;
  };
}

interface SectionDTO {
  id: number;
  title: string;
  title_ar?: string;
  background_color?: string;
  display_order: number;
  business_limit: number;
  page_title?: string;
  page_description?: string;
  display_title: string;
  display_description: string;
  cta: {
    title?: string;
    category_slug?: string;
    tags: string[];
    filters: Record<string, string>;
  };
  businesses: BusinessDTO[];
}

// Map backend Business DTO to frontend entity
function mapBusinessDTO(dto: BusinessDTO): Business {
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
    rating: {
      average: dto.rating.average,
      count: dto.rating.count,
    },
    views_count: dto.view_count,
    attributes: dto.attributes,
    is_open: true,
    display_title: dto.name, // Default fallback
    display_description: dto.about || '', // Default fallback
  };
}

// Map backend Section DTO to frontend entity
function mapSectionDTO(dto: SectionDTO): Section {
  return {
    id: dto.id,
    title: dto.title,
    title_ar: dto.title_ar,
    background_color: dto.background_color,
    display_order: dto.display_order,
    business_limit: dto.business_limit,
    page_title: dto.page_title,
    page_description: dto.page_description,
    display_title: dto.display_title,
    display_description: dto.display_description,
    cta: {
      title: dto.cta.title,
      category_slug: dto.cta.category_slug,
      tags: dto.cta.tags,
      filters: dto.cta.filters,
    },
    businesses: dto.businesses.map(mapBusinessDTO),
  };
}

export class SectionRepository {
  async getAllSections(locale: string = 'ar'): Promise<Section[]> {
    const response = await apiClient.get<{ data: { sections: SectionDTO[] } }>(
      '/sections',
      { headers: { 'X-Language': locale } }
    );
    return response.data.sections.map(mapSectionDTO);
  }
}

export const sectionRepository = new SectionRepository();
