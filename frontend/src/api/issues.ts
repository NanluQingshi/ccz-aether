import client from './client';
import type { ApiResponse } from '../types/api';
import type { IssueStatus, IssuePriority } from '../constants/issueStatus';

export interface Issue {
  id: number;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: string;
  updatedAt: string;
}

export interface IssueRequest {
  title: string;
  description?: string;
  priority: IssuePriority;
}

export const getIssues = () =>
  client.get<never, ApiResponse<Issue[]>>('/api/issues');

export const createIssue = (data: IssueRequest) =>
  client.post<never, ApiResponse<Issue>>('/api/issues', data);

export const updateIssue = (id: number, data: IssueRequest) =>
  client.put<never, ApiResponse<Issue>>(`/api/issues/${id}`, data);

export const updateIssueStatus = (id: number, status: IssueStatus) =>
  client.patch<never, ApiResponse<Issue>>(`/api/issues/${id}/status`, { status });

export const deleteIssue = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/issues/${id}`);
