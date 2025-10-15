import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v2';

export interface FilterOption {
  id: number;
  slug: string;
  label: string;
  value: string;
  is_default: boolean;
  display_order: number;
}

export interface Filter {
  id: number;
  slug: string;
  label: string;
  type: string;
  display_order: number;
  is_active: boolean;
  options: FilterOption[];
}

export interface FiltersResponse {
  data: {
    filters: Filter[];
  };
  message: string | null;
}

class FilterRepository {
  /**
   * Get filters for a specific category
   */
  async getFiltersByCategory(categorySlug: string, locale: string = 'en'): Promise<Filter[]> {
    try {
      const response = await axios.get<FiltersResponse>(
        `${API_BASE_URL}/categories/${categorySlug}/filters`,
        {
          headers: {
            'Accept-Language': locale,
          },
        }
      );

      return response.data.data.filters;
    } catch (error) {
      console.error('Error fetching filters:', error);
      return [];
    }
  }

  /**
   * Get all filters (admin/debug)
   */
  async getAllFilters(locale: string = 'en'): Promise<Filter[]> {
    try {
      const response = await axios.get<FiltersResponse>(
        `${API_BASE_URL}/filters/all`,
        {
          headers: {
            'Accept-Language': locale,
          },
        }
      );

      return response.data.data.filters;
    } catch (error) {
      console.error('Error fetching all filters:', error);
      return [];
    }
  }
}

export const filterRepository = new FilterRepository();
