import { Business } from './Business';

export interface Section {
  id: number;
  title: string;
  title_ar?: string;
  background_color?: string;
  display_order: number;
  business_limit: number;
  cta: {
    title?: string;
    category_slug?: string;
    tags: string[];
    filters: Record<string, string>;
  };
  businesses: Business[];
}

export interface SectionsResponse {
  sections: Section[];
}
