import client from './client';
import type { ApiResponse } from '../types/api';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const login = (data: LoginRequest) =>
  client.post<never, ApiResponse<LoginResponse>>('/api/auth/login', data);
