import { apiClient } from '../api/client';
import { Review, ReviewSummary, ReviewsResponse } from '@/domain/entities/Review';

// DTOs matching backend response structure
interface ReviewDTO {
  id: number;
  business_id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsResponseDTO {
  reviews: ReviewDTO[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

interface ReviewSummaryDTO {
  summary: {
    average_rating: number;
    total_reviews: number;
    rating_breakdown: {
      [key: string]: number;
    };
  };
}

interface CreateReviewRequest {
  rating: number;
  comment: string;
  image_urls?: string[];
}

// Mappers
const mapReviewDTOToReview = (dto: ReviewDTO): Review => ({
  id: dto.id,
  businessId: dto.business_id,
  userId: dto.user_id,
  userName: dto.user_name,
  userAvatar: dto.user_avatar,
  rating: dto.rating,
  comment: dto.comment,
  createdAt: dto.created_at,
});

const mapReviewSummaryDTOToReviewSummary = (dto: ReviewSummaryDTO): ReviewSummary => ({
  averageRating: dto.summary.average_rating,
  totalReviews: dto.summary.total_reviews,
  ratingBreakdown: dto.summary.rating_breakdown,
});

export class ReviewRepository {
  async getReviewsBySlug(
    slug: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ReviewsResponse> {
    const response = await apiClient.get<{ data: ReviewsResponseDTO }>(
      `/directories/businesses/${slug}/reviews`,
      {
        params: { page, limit },
      }
    );

    return {
      reviews: response.data.reviews.map(mapReviewDTOToReview),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      hasMore: response.data.has_more,
    };
  }

  async getReviewSummaryBySlug(slug: string): Promise<ReviewSummary> {
    const response = await apiClient.get<{ data: ReviewSummaryDTO }>(
      `/directories/businesses/${slug}/reviews/summary`
    );

    return mapReviewSummaryDTOToReviewSummary(response.data);
  }

  async createReview(
    slug: string,
    rating: number,
    comment: string,
    imageUrls?: string[]
  ): Promise<Review> {
    const requestData: CreateReviewRequest = {
      rating,
      comment,
      image_urls: imageUrls,
    };

    const response = await apiClient.post<{ data: { review: ReviewDTO } }>(
      `/directories/businesses/${slug}/reviews`,
      requestData
    );

    return mapReviewDTOToReview(response.data.review);
  }
}

export const reviewRepository = new ReviewRepository();
