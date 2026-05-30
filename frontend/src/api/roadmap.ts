import client from './client';
import type { ApiResponse } from '../types/api';
import type { RoadmapStatus, RoadmapPriority } from '../constants/roadmapStatus';

export interface RoadmapItem {
  id: number;
  groupLabel: string;
  groupIcon?: string;
  name: string;
  description?: string;
  status: RoadmapStatus;
  priority?: RoadmapPriority;
  sortOrder: number;
  createdAt: string;
}

export interface RoadmapItemRequest {
  groupLabel: string;
  groupIcon?: string;
  name: string;
  description?: string;
  status: RoadmapStatus;
  priority?: RoadmapPriority;
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
