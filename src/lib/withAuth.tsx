'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

export interface WithAuthOptions {
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
}

/**
 * 高阶组件：页面级别认证保护
 * @example
 * ```tsx
 * const ProtectedPage = withAuth(
 *   function DashboardPage() {
 *     return <div>Dashboard</div>;
 *   },
 *   { requiredRoles: [UserRole.ADMIN] }
 * );
 * ```
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { requiredRoles = [], requiredPermissions = [], fallback } = options;

  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();

    // 加载中显示空页面
    if (isLoading) {
      return fallback || <div className="flex items-center justify-center min-h-screen">加载中...</div>;
    }

    // 未认证，重定向到登录页
    if (!isAuthenticated || !user) {
      if (typeof window !== 'undefined') {
        router.push(`/login?redirect=${window.location.pathname}`);
      }
      return fallback || <div className="flex items-center justify-center min-h-screen">重定向中...</div>;
    }

    // 检查角色
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      return fallback || <div className="flex items-center justify-center min-h-screen">权限不足</div>;
    }

    // 检查权限
    if (requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every((permission) =>
        user.permissions.includes(permission)
      );

      if (!hasAllPermissions) {
        return fallback || <div className="flex items-center justify-center min-h-screen">权限不足</div>;
      }
    }

    // 通过所有检查，渲染组件
    return <Component {...props} />;
  };
}

/**
 * Server Component 认证守卫
 * 用于 Server Components 的认证检查
 * @example
 * ```tsx
 * import { requireAuth } from '@/lib/auth-guard';
 * 
 * export default async function DashboardPage() {
 *   const user = await requireAuth({ requiredRoles: [UserRole.ADMIN] });
 *   return <div>Hello {user.name}</div>;
 * }
 * ```
 */
export async function requireAuth(options: WithAuthOptions = {}) {
  const { requiredRoles = [], requiredPermissions = [] } = options;

  // 从 headers 获取 user 信息（由 middleware 注入）
  // 注意：这是伪代码，实际需要从 server 端获取
  // 通常通过 request context 或 database 查询实现

  throw new Error('NotAuthenticated');
}
