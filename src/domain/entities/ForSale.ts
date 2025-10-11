export interface ForSaleService {
  id: string;
  icon: string;
  name: string;
  price?: number;
  price_start_from: boolean;
}

export interface ForSaleListing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  created_at: string;
  url?: string;
  location?: string;
}

export interface ForSaleListingsResponse {
  listings: ForSaleListing[];
  total: number;
  page: number;
  page_size: number;
}

export interface ForSaleServicesResponse {
  services: ForSaleService[];
  total: number;
}
