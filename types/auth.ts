/**
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest',
}

/**
 * 用户权限枚举
 */
export enum Permission {
  // 用户管理
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // 数据分析
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_EXPORT = 'analytics:export',

  // 报表
  REPORT_CREATE = 'report:create',
  REPORT_READ = 'report:read',
  REPORT_UPDATE = 'report:update',
  REPORT_DELETE = 'report:delete',

  // 设置
  SETTINGS_READ = 'settings:read',
  SETTINGS_UPDATE = 'settings:update',
}

/**
 * 用户信息接口
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 认证上下文接口
 */
export interface AuthContext {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

/**
 * JWT Token 载荷
 */
export interface JWTPayload {
  sub: string; // subject (user id)
  email: string;
  role: UserRole;
  permissions: Permission[];
  tenantId: string;
  iat: number; // issued at
  exp: number; // expiration time
}

/**
 * 多租户上下文
 */
export interface TenantContext {
  tenantId: string;
  tenantName: string;
  features: {
    multiUser: boolean;
    analytics: boolean;
    reporting: boolean;
  };
}

/**
 * 中间件请求上下文
 */
export interface RequestContext {
  user?: User;
  tenant?: TenantContext;
  locale?: string;
  abTestVariant?: string;
  region?: string;
}
