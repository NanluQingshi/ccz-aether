import client from './client';
import type { ApiResponse } from '../types/api';

export interface RoadmapItem {
  id: number;
  groupLabel: string;
  groupIcon?: string;
  name: string;
  description?: string;
  status: 'done' | 'planned';
  priority?: 'high' | 'medium' | 'low';
  sortOrder: number;
  createdAt: string;
}

export interface RoadmapItemRequest {
  groupLabel: string;
  groupIcon?: string;
  name: string;
  description?: string;
  status: 'done' | 'planned';
  priority?: 'high' | 'medium' | 'low' | '';
  sortOrder?: number;
}

export const getRoadmapItems = () =>
  client.get<never, ApiResponse<RoadmapItem[]>>('/api/roadmap');

export const createRoadmapItem = (data: RoadmapItemRequest) =>
  client.post<never, ApiResponse<RoadmapItem>>('/api/roadmap', data);

export const updateRoadmapItem = (id: number, data: RoadmapItemRequest) =>
  client.put<never, ApiResponse<RoadmapItem>>(`/api/roadmap/${id}`, data);

export const deleteRoadmapItem = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/roadmap/${id}`);
