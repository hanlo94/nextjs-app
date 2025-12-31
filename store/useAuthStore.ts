import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthContext, JWTPayload } from '@/types/auth';
import { AUTH_CONSTANTS } from '@/lib/auth-constants';

interface AuthStore extends AuthContext {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  logout: () => void;
  login: (user: User) => void;
  checkToken: () => Promise<void>;
}

/**
 * 认证状态管理 Store
 * 使用 Zustand 的 persist 中间件自动保存到 localStorage
 * 使用 skipHydration 避免 SSR 时的 hydration mismatch
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          error: null,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      login: (user) => {
        set({
          user,
          isAuthenticated: true,
          error: null,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
        // 清除 Cookie
        if (typeof window !== 'undefined') {
          document.cookie = `${AUTH_CONSTANTS.TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
          document.cookie = `${AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        }
      },

      checkToken: async () => {
        set({ isLoading: true });
        try {
          // 调用后端 API 验证 token
          const response = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include', // 包含 cookies
          });

          if (!response.ok) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
            return;
          }

          const user: User = await response.json();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error : new Error('检查 token 失败'),
          });
        }
      },
    }),
    {
      name: 'auth-store', // localStorage key
      skipHydration: true, // 跳过初始 hydration，避免 SSR 时的不匹配
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

/**
 * 选择器工厂函数，优化组件重新渲染
 */
export const createAuthSelectors = <T,>(
  selector: (state: AuthStore) => T
) => ({
  useShallow: () => selector(useAuthStore()),
  useDeep: () => useAuthStore(selector),
});

export const authSelectors = {
  useUser: () => useAuthStore((state) => state.user),
  useIsAuthenticated: () => useAuthStore((state) => state.isAuthenticated),
  useIsLoading: () => useAuthStore((state) => state.isLoading),
  useError: () => useAuthStore((state) => state.error),
  useSetUser: () => useAuthStore((state) => state.setUser),
  useSetLoading: () => useAuthStore((state) => state.setLoading),
  useSetError: () => useAuthStore((state) => state.setError),
  useLogin: () => useAuthStore((state) => state.login),
  useLogout: () => useAuthStore((state) => state.logout),
  useCheckToken: () => useAuthStore((state) => state.checkToken),
  useAuthActions: () => useAuthStore((state) => ({
    setUser: state.setUser,
    setLoading: state.setLoading,
    setError: state.setError,
    login: state.login,
    logout: state.logout,
    checkToken: state.checkToken,
  })),
};
