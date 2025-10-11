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
}

export interface CategoryWithSubcategories extends Category {
  subcategories?: Category[];
}
