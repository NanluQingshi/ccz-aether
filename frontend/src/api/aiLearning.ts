import client from './client';
import type { ApiResponse } from '../types/api';

export interface AiNodeResource {
  title: string;
  url: string;
}

export const AiNodeStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;
export type AiNodeStatus = typeof AiNodeStatus[keyof typeof AiNodeStatus];

export interface AiNode {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  status: AiNodeStatus;
  parentId?: number;
  resources: AiNodeResource[];
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AiNodeRequest {
  title: string;
  description?: string;
  icon?: string;
  status?: AiNodeStatus;
  parentId?: number;
  resources?: AiNodeResource[];
  sortOrder?: number;
}

export const getAiNodes = () =>
  client.get<never, ApiResponse<AiNode[]>>('/api/ai-nodes');

export const createAiNode = (data: AiNodeRequest) =>
  client.post<never, ApiResponse<AiNode>>('/api/ai-nodes', data);

export const updateAiNode = (id: number, data: AiNodeRequest) =>
  client.put<never, ApiResponse<AiNode>>(`/api/ai-nodes/${id}`, data);

export const deleteAiNode = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/ai-nodes/${id}`);
