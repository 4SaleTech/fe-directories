export interface Article {
  id: number;
  title: string;
  title_ar: string;
  slug: string;
  excerpt?: string;
  excerpt_ar?: string;
  content: string;
  content_ar: string;
  featured_image?: string;
  category_id?: number;
  author?: string;
  published_at: string;
  views_count?: number;
}

export interface ArticleComment {
  id: number;
  article_id: number;
  user_id: number;
  user_name: string;
  comment: string;
  parent_comment_id?: number;
  likes_count: number;
  is_liked: boolean;
  created_at: string;
  replies?: ArticleComment[];
}
