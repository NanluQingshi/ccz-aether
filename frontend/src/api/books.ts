import client from './client';
import type { ApiResponse } from '../types/api';
import type { Book, BookRequest } from '../types/book';

export type { Book, BookRequest };

export const getBooks = () =>
  client.get<never, ApiResponse<Book[]>>('/api/books');

export const createBook = (data: BookRequest) =>
  client.post<never, ApiResponse<Book>>('/api/books', data);

export const updateBook = (id: number, data: BookRequest) =>
  client.put<never, ApiResponse<Book>>(`/api/books/${id}`, data);

export const deleteBook = (id: number) =>
  client.delete<never, ApiResponse<void>>(`/api/books/${id}`);
