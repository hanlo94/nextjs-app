'use client';

import { useUser } from '@/hooks/useAuth';
import { ROLE_PERMISSIONS } from '@/lib/auth-constants';

/**
 * 权限检查 Hook
 * 提供细粒度的权限检查能力
 * @example
 * ```tsx
 * const { hasPermission, can } = usePermission();
 * 
 * if (!hasPermission('user:create')) {
 *   return <div>无权限</div>;
 * }
 * ```
 */
export function usePermission() {
  const user = useUser();

  /**
   * 检查用户是否具有特定权限
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  /**
   * 检查用户是否具有多个权限中的任何一个（OR 关系）
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.some((permission) => user.permissions.includes(permission));
  };

  /**
   * 检查用户是否具有所有权限（AND 关系）
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.every((permission) => user.permissions.includes(permission));
  };

  /**
   * 条件渲染权限检查
   */
  const can = (permission: string | string[]): boolean => {
    if (Array.isArray(permission)) {
      return hasAllPermissions(permission);
    }
    return hasPermission(permission);
  };

  /**
   * 检查用户是否为特定角色
   */
  const isRole = (role: string): boolean => {
    return user?.role === role;
  };

  /**
   * 检查用户角色是否在指定列表中
   */
  const isAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  /**
   * 获取用户的所有权限
   */
  const getPermissions = (): string[] => {
    return user?.permissions ?? [];
  };

  /**
   * 获取用户的角色
   */
  const getRole = (): string | null => {
    return user?.role ?? null;
  };

  /**
   * 基于角色获取默认权限
   */
  const getDefaultPermissionsByRole = (role: string): string[] => {
    return ROLE_PERMISSIONS[role] ?? [];
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    can,
    isRole,
    isAnyRole,
    getPermissions,
    getRole,
    getDefaultPermissionsByRole,
    user,
  };
}

/**
 * 权限检查组件
 * @example
 * ```tsx
 * <CanAccess permission="user:create">
 *   <button>创建用户</button>
 * </CanAccess>
 * ```
 */
interface CanAccessProps {
  permission?: string | string[];
  role?: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function CanAccess({ permission, role, fallback = null, children }: CanAccessProps) {
  const { can, isRole, isAnyRole } = usePermission();

  let hasAccess = true;

  if (permission) {
    hasAccess = hasAccess && can(permission);
  }

  if (role) {
    if (Array.isArray(role)) {
      hasAccess = hasAccess && isAnyRole(role);
    } else {
      hasAccess = hasAccess && isRole(role);
    }
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
