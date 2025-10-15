import { Tag } from '@/domain/entities/Tag';

export class TagRepository {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v2') {
    this.baseUrl = baseUrl;
  }

  async getTags(type?: string, language: string = 'ar'): Promise<Tag[]> {
    try {
      const params = new URLSearchParams();
      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`${this.baseUrl}/tags?${params.toString()}`, {
        headers: {
          'Accept-Language': language,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  async getTagBySlug(slug: string, language: string = 'ar'): Promise<Tag | null> {
    try {
      const response = await fetch(`${this.baseUrl}/tags/${slug}`, {
        headers: {
          'Accept-Language': language,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch tag: ${response.statusText}`);
      }

      const data = await response.json();
      return data.tag || null;
    } catch (error) {
      console.error('Error fetching tag:', error);
      throw error;
    }
  }

  async getTagsByCategory(categorySlug: string, language: string = 'ar'): Promise<Tag[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories/${categorySlug}/tags`, {
        headers: {
          'Accept-Language': language,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tags for category: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching category tags:', error);
      throw error;
    }
  }
}

export const tagRepository = new TagRepository();
