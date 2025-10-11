import { apiClient } from '../api/client';
import { ForSaleListing, ForSaleService, ForSaleListingsResponse, ForSaleServicesResponse } from '@/domain/entities/ForSale';

export class ForSaleRepository {
  async getListings(
    slug: string,
    params: { page?: number; page_size?: number } = {}
  ): Promise<ForSaleListingsResponse> {
    const queryParams = new URLSearchParams({
      page: String(params.page || 1),
      page_size: String(params.page_size || 30),
    });

    const response = await apiClient.get<{ data: ForSaleListingsResponse }>(
      `/directories/businesses/${slug}/forsale-listings?${queryParams}`
    );

    return {
      listings: response.data.listings || [],
      total: response.data.total || 0,
      page: response.data.page || params.page || 1,
      page_size: response.data.page_size || params.page_size || 30,
    };
  }

  async getServices(slug: string): Promise<ForSaleServicesResponse> {
    const response = await apiClient.get<{ data: ForSaleServicesResponse }>(
      `/directories/businesses/${slug}/forsale-services`
    );

    return {
      services: response.data.services || [],
      total: response.data.total || 0,
    };
  }
}

export const forSaleRepository = new ForSaleRepository();
