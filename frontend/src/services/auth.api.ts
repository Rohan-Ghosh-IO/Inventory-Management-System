import { authApiClient } from './api-client';
import { ApiResponse, User } from '../types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}

export interface LoginResponseData {
  token: string;
  user: User;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<ApiResponse<LoginResponseData>> => {
    const response = await authApiClient.post<ApiResponse<LoginResponseData>>('/auth/login', payload);
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<User>> => {
    const response = await authApiClient.post<ApiResponse<User>>('/auth/register', payload);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await authApiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<ApiResponse<void>> => {
    const response = await authApiClient.post<ApiResponse<void>>('/auth/change-password', payload);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await authApiClient.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },
};
