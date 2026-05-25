import client from './client';
import type { ApiResponse } from '../types/api';
import type { RoadmapItem, RoadmapItemRequest } from '../types/roadmap';

export type { RoadmapItem, RoadmapItemRequest };

export const getRoadmapItems = () =>
  client.get<never, ApiResponse<RoadmapItem[]>>('/api/roadmap');

export const createRoadmapItem = (data: RoadmapItemRequest) =>
  client.post<never, ApiResponse<RoadmapItem>>('/api/roadmap', data);

export const updateRoadmapItem = (id: number, data: RoadmapItemRequest) =>
  client.put<never, ApiResponse<RoadmapItem>>(`/api/roadmap/${id}`, data);

export const deleteRoadmapItem = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/roadmap/${id}`);
