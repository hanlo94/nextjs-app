'use client';

/**
 * 从根目录 store 重新导出
 * 支持在 src/ 下的文件中导入
 */
export { useAuthStore, createAuthSelectors, authSelectors } from '@/store/useAuthStore';

// 客户端初始化 hydration
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export function useAuthHydration() {
  useEffect(() => {
    // 在客户端挂载后触发 persist hydration
    useAuthStore.persist.rehydrate();
  }, []);
}
