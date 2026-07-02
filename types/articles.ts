export interface Author {
  id: string;
  user_id: string;
  full_name: string;
  photo_url: string | null;
  instagram: string | null;
  linkedin: string | null;
  email: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  author_id: string;
  title: string;
  summary: string;
  body: unknown;
  header_image_url: string | null;
  header_image_public_id: string | null;
  slug: string;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleImage {
  id: string;
  article_id: string;
  url: string;
  public_id: string | null;
  caption: string | null;
  position: number | null;
  created_at: string;
}

export interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface ArticleWithAuthor extends Article {
  author: Author;
}

export interface NewArticlePayload {
  author_id: string;
  title: string;
  summary: string;
  body: unknown;
  header_image_url?: string | null;
  header_image_public_id?: string | null;
  slug: string;
  status?: 'draft' | 'published';
  published_at?: string | null;
}

export interface NewCommentPayload {
  article_id: string;
  author_name: string;
  content: string;
}
