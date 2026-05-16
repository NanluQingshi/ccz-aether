import client from './client';
import type { ApiResponse } from '../types/api';

export interface Book {
  id: number;
  title: string;
  author: string;
  cover?: string;
  status: 'want' | 'reading' | 'done';
  rating?: number;
  review?: string;
  category?: string;
  totalPages?: number;
  readPages?: number;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookRequest {
  title: string;
  author: string;
  cover?: string;
  status: 'want' | 'reading' | 'done';
  rating?: number;
  review?: string;
  category?: string;
  totalPages?: number;
  readPages?: number;
  startedAt?: string;
  finishedAt?: string;
}

export const getBooks = () =>
  client.get<never, ApiResponse<Book[]>>('/api/books');

export const createBook = (data: BookRequest) =>
  client.post<never, ApiResponse<Book>>('/api/books', data);

export const updateBook = (id: number, data: BookRequest) =>
  client.put<never, ApiResponse<Book>>(`/api/books/${id}`, data);

export const deleteBook = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/books/${id}`);
