import client from './client';
import type { ApiResponse } from '../types/api';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const login = (data: LoginRequest) =>
  client.post<never, ApiResponse<LoginResponse>>('/api/auth/login', data);

export const logout = () =>
  client.post<never, ApiResponse<null>>('/api/auth/logout');

export const checkAuth = () =>
  client.get<never, ApiResponse<LoginResponse>>('/api/auth/me');
