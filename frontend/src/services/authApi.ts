import { apiClient } from './api';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../types/auth';

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    apiClient.setToken(response.token);
    return response;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    apiClient.setToken(response.token);
    return response;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post<void>('/auth/logout');
    apiClient.setToken(null);
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/auth/me');
  },
};
