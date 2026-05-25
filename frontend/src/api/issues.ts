import client from './client';
import type { ApiResponse } from '../types/api';
import type { Issue, IssueRequest } from '../types/issue';

export type { Issue, IssueRequest };

export const getIssues = () =>
  client.get<never, ApiResponse<Issue[]>>('/api/issues');

export const createIssue = (data: IssueRequest) =>
  client.post<never, ApiResponse<Issue>>('/api/issues', data);

export const updateIssue = (id: number, data: IssueRequest) =>
  client.put<never, ApiResponse<Issue>>(`/api/issues/${id}`, data);

export const updateIssueStatus = (id: number, status: 0 | 1 | 2) =>
  client.patch<never, ApiResponse<Issue>>(`/api/issues/${id}/status`, { status });

export const deleteIssue = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/issues/${id}`);
