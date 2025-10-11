export interface Review {
  id: number;
  businessId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount?: number;
  isHelpful?: boolean;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    [key: string]: number;
  };
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
