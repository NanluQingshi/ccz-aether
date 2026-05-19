import client from './client';
import type { ApiResponse } from '../types/api';

export interface Practice {
  id: number;
  category: string;
  categoryIcon: string;
  name: string;
  description: string;
  status: 'todo' | 'in_progress' | 'mastered';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PracticeRequest {
  category: string;
  categoryIcon: string;
  name: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'mastered';
  sortOrder: number;
}

export const getPractices = () =>
  client.get<never, ApiResponse<Practice[]>>('/api/practice');

export const createPractice = (data: PracticeRequest) =>
  client.post<never, ApiResponse<Practice>>('/api/practice', data);

export const updatePractice = (id: number, data: PracticeRequest) =>
  client.put<never, ApiResponse<Practice>>(`/api/practice/${id}`, data);

export const deletePractice = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/practice/${id}`);
