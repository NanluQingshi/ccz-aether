import client from './client';
import type { ApiResponse } from '../types/api';
import type { TagVO } from '../types/tag';

export const getTags = () =>
  client.get<never, ApiResponse<TagVO[]>>('/api/tags');

export const adminCreateTag = (name: string, slug?: string) =>
  client.post<never, ApiResponse<TagVO>>('/api/admin/tags', { name, slug });

export const adminUpdateTag = (id: number, name: string, slug?: string) =>
  client.put<never, ApiResponse<TagVO>>(`/api/admin/tags/${id}`, { name, slug });

export const adminDeleteTag = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/admin/tags/${id}`);
