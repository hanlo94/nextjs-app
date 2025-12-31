'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore, authSelectors } from '@/store/useAuthStore';

/**
 * 通用认证 Hook
 * 提供当前用户信息和认证状态
 */
export function useAuth() {
  const user = authSelectors.useUser();
  const isAuthenticated = authSelectors.useIsAuthenticated();
  const isLoading = authSelectors.useIsLoading();
  const error = authSelectors.useError();
  const checkToken = authSelectors.useCheckToken();
  const logout = authSelectors.useLogout();
  const login = authSelectors.useLogin();
  const setUser = authSelectors.useSetUser();
  const setLoading = authSelectors.useSetLoading();
  const setError = authSelectors.useSetError();

  // 使用 useRef 追踪是否已初始化，避免重复调用 checkToken
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && !isAuthenticated && !user) {
      initializedRef.current = true;
      checkToken();
    }
  }, [isAuthenticated, user, checkToken]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setLoading,
    setError,
    login,
    logout,
    checkToken,
  };
}

/**
 * 用户信息 Hook
 */
export function useUser() {
  return authSelectors.useUser();
}

/**
 * 认证状态 Hook
 */
export function useIsAuthenticated() {
  return authSelectors.useIsAuthenticated();
}

/**
 * 加载状态 Hook
 */
export function useIsAuthLoading() {
  return authSelectors.useIsLoading();
}
