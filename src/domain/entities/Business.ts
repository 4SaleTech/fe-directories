import { Tag } from './Tag';

export interface AvailableTabs {
  has_branches: boolean;
  has_working_hours: boolean;
  has_faqs: boolean;
  has_services: boolean;
  has_media: boolean;
  has_reviews: boolean;
}

export interface BusinessTab {
  id: number;
  slug: string;
  label: string; // Localized label from backend
  type: 'native' | 'webview';
  content_type: string;
  order: number;
  enabled: boolean;
  webview_url?: string;
}

export interface Business {
  id: number;
  slug: string;
  name: string;
  name_ar: string;
  about?: string;
  about_ar?: string;
  category_id: number;
  category_name?: string;
  category_name_ar?: string;
  category_slug?: string;
  logo?: string;
  cover_image?: string;
  rating: {
    average: number;
    count: number;
  };
  views_count: number;
  attributes?: Record<string, string>; // Dynamic attributes (e.g., verified: "true", featured: "false", premium: "true")
  is_open: boolean;
  contact_info?: {
    contact_numbers: string[];
    whatsapp: string[];
    email: string;
    website: string;
  };
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  tags?: Tag[];
  distance?: number; // in minutes or km
  price_range?: string; // e.g., "9 د.ك"
  address?: string; // Business address
  location?: {
    latitude?: number;
    longitude?: number;
  };
  available_tabs?: AvailableTabs; // Deprecated: Use tabs array instead
  tabs?: BusinessTab[]; // New: Localized tabs from backend
}

export interface WorkingHours {
  id: number;
  business_id: number;
  day: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  open_time: string;
  close_time: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: number;
  name: string;
  name_ar: string;
  address: string;
  address_ar: string;
  latitude?: number;
  longitude?: number;
  contact_number?: string;
}

export interface Service {
  id: number;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  price?: number;
  discounted_price?: number;
  currency?: string;
  images?: string[];
}

export interface Review {
  id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface FAQ {
  id: number;
  business_id: number;
  question: string;
  question_ar: string;
  answer: string;
  answer_ar: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessMedia {
  id: number;
  business_id: number;
  type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  caption?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
