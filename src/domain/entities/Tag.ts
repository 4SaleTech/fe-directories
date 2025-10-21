export interface Tag {
  id: number;
  name: string; // Localized by backend based on Accept-Language header
  slug: string;
  type: string;
  icon?: string;
  description?: string;
  display_order: number;
  usage_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
