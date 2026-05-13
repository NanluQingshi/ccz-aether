import type { CategoryVO } from './category';
import type { TagVO } from './tag';

export type PostType = 'blog' | 'ai_timeline';

export interface PostVO {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  coverImage?: string;
  type: PostType;
  eventDate?: string;
  status: number;
  viewCount: number;
  createdAt: string;
  publishedAt?: string;
  category?: CategoryVO;
  tags: TagVO[];
}

export interface PostDetailVO extends PostVO {
  content: string;
  updatedAt: string;
}

export interface PostCreateRequest {
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  coverImage?: string;
  type?: PostType;
  eventDate?: string;
  categoryId?: number;
  tagIds?: number[];
  status?: number;
}

export interface PostUpdateRequest extends PostCreateRequest {}
