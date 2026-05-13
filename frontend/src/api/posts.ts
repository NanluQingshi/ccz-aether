import client from './client';
import type { ApiResponse, PageResult } from '../types/api';
import type { PostVO, PostDetailVO, PostCreateRequest, PostUpdateRequest } from '../types/post';

export const getPosts = (params: {
  page?: number;
  size?: number;
  tagSlug?: string;
  categorySlug?: string;
  keyword?: string;
}) => client.get<never, ApiResponse<PageResult<PostVO>>>('/api/posts', { params });

export const getPostBySlug = (slug: string) =>
  client.get<never, ApiResponse<PostDetailVO>>(`/api/posts/${slug}`);

export const getAiTimeline = () =>
  client.get<never, ApiResponse<PostVO[]>>('/api/posts/ai-timeline');

export const adminGetPosts = (page = 1, size = 10) =>
  client.get<never, ApiResponse<PageResult<PostVO>>>('/api/admin/posts', { params: { page, size } });

export const adminCreatePost = (data: PostCreateRequest) =>
  client.post<never, ApiResponse<PostDetailVO>>('/api/admin/posts', data);

export const adminUpdatePost = (id: number, data: PostUpdateRequest) =>
  client.put<never, ApiResponse<PostDetailVO>>(`/api/admin/posts/${id}`, data);

export const adminDeletePost = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/admin/posts/${id}`);

export const adminTogglePublish = (id: number) =>
  client.patch<never, ApiResponse<PostVO>>(`/api/admin/posts/${id}/publish`);

export const adminGetStats = () =>
  client.get<never, ApiResponse<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    totalTags: number;
    totalCategories: number;
  }>>('/api/admin/stats');
