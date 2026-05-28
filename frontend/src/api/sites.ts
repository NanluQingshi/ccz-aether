import client from './client';
import type { ApiResponse } from '../types/api';

export interface Site {
  id: number;
  name: string;
  url: string;
  category: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SiteRequest {
  name: string;
  url: string;
  category: string;
  sortOrder?: number;
}

export const getSites = () =>
  client.get<never, ApiResponse<Site[]>>('/api/sites');

export const createSite = (data: SiteRequest) =>
  client.post<never, ApiResponse<Site>>('/api/sites', data);

export const updateSite = (id: number, data: SiteRequest) =>
  client.put<never, ApiResponse<Site>>(`/api/sites/${id}`, data);

export const deleteSite = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/sites/${id}`);
