'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * 认证 Hydration Provider
 * 在客户端初始化时，重新 hydrate 从 localStorage 保存的认证状态
 */
export default function AuthHydrationProvider({ children }: { children: ReactNode }) {
  const hydratedRef = useRef(false);

  useEffect(() => {
    // 仅在第一次挂载时执行 hydration，避免重复调用
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      useAuthStore.persist.rehydrate();
    }
  }, []);

  return <>{children}</>;
}
