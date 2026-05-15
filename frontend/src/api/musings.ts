import client from './client';
import type { ApiResponse } from '../types/api';

export interface Musing {
  id: number;
  content: string;
  type: 'idea' | 'todo';
  done: number;
  createdAt: string;
  updatedAt: string;
}

export interface MusingRequest {
  content: string;
  type: 'idea' | 'todo';
}

export const getMusings = () =>
  client.get<never, ApiResponse<Musing[]>>('/api/musings');

export const createMusing = (data: MusingRequest) =>
  client.post<never, ApiResponse<Musing>>('/api/musings', data);

export const updateMusing = (id: number, data: MusingRequest) =>
  client.put<never, ApiResponse<Musing>>(`/api/musings/${id}`, data);

export const toggleMusingDone = (id: number) =>
  client.patch<never, ApiResponse<Musing>>(`/api/musings/${id}/toggle`);

export const deleteMusing = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/musings/${id}`);
