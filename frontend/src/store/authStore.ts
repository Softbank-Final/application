import { create } from 'zustand';
import type { User, AuthState } from '../types/auth';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  // 비동기 액션들은 아직 인터페이스에만 정의하거나, 2단계에서 추가
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // 초기 로딩 상태

  // 단순 상태 변경 (Synchronous Actions)
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  // 1단계에서는 비동기 로직의 껍데기만 생성 (Placeholder)
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
}));