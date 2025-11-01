export interface CategorySEO {
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  name_ar: string;
  icon?: string;
  description?: string;
  description_ar?: string;
  parent_id?: number;
  businesses_count?: number;
  page_title?: string;
  page_description?: string;
  display_title: string;
  display_description: string;
  seo?: CategorySEO;
}

export interface CategoryWithSubcategories extends Category {
  subcategories?: Category[];
}
