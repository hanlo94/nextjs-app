'use client';

/**
 * 从根目录 hooks 重新导出
 * 支持在 src/ 下的文件中导入
 */
export { useAuth, useUser, useIsAuthenticated, useIsAuthLoading } from '@/hooks/useAuth';
