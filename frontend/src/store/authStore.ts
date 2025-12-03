import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 미들웨어 임포트
import type { User, AuthState } from '../types/auth';
import { authApi } from '../services/authApi';

interface AuthStore extends AuthState {
    setUser: (user: User | null) => void;
    setLoading: (isLoading: boolean) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: true,

            setUser: (user) =>
                set({
                    user,
                    isAuthenticated: !!user,
                    isLoading: false,
                }),

            setLoading: (isLoading) => set({ isLoading }),

            // 로그인 로직 구현
            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    const response = await authApi.login({ email, password });
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },
            // 회원가입 로직 구현
            register: async (email, password, name) => {
                set({ isLoading: true });
                try {
                    const response = await authApi.register({ email, password, name });
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },
            // 로그아웃 로직 구현
            logout: async () => {
                try {
                    await authApi.logout();
                } finally {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            },

            // 세션 확인 및 복구 로직
            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    const user = await authApi.getCurrentUser();
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            },
        }),
        {
            name: 'auth-storage', // localStorage key 이름
            partialize: (state) => ({ // 저장할 상태 선택
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);