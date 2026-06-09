import client from './client';
import type { ApiResponse } from '../types/api';
import type { CategoryVO } from '../types/category';

export const getCategories = () =>
  client.get<never, ApiResponse<CategoryVO[]>>('/api/categories');

export const adminCreateCategory = (name: string, slug?: string, description?: string) =>
  client.post<never, ApiResponse<CategoryVO>>('/api/admin/categories', { name, slug, description });

export const adminUpdateCategory = (id: number, name: string, slug?: string, description?: string) =>
  client.put<never, ApiResponse<CategoryVO>>(`/api/admin/categories/${id}`, { name, slug, description });

export const adminDeleteCategory = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/admin/categories/${id}`);
