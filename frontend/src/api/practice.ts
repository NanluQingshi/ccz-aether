import client from './client';
import type { ApiResponse } from '../types/api';
import type { Practice, PracticeRequest, PracticeLink } from '../types/practice';

export type { Practice, PracticeRequest, PracticeLink };

export const getPractices = () =>
  client.get<never, ApiResponse<Practice[]>>('/api/practice');

export const createPractice = (data: PracticeRequest) =>
  client.post<never, ApiResponse<Practice>>('/api/practice', data);

export const updatePractice = (id: number, data: PracticeRequest) =>
  client.put<never, ApiResponse<Practice>>(`/api/practice/${id}`, data);

export const deletePractice = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/practice/${id}`);
