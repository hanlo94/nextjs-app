/**
 * 权限检查常量
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'analytics:view',
    'analytics:export',
    'report:create',
    'report:read',
    'report:update',
    'report:delete',
    'settings:read',
    'settings:update',
  ],
  manager: [
    'user:read',
    'user:update',
    'analytics:view',
    'analytics:export',
    'report:create',
    'report:read',
    'report:update',
    'settings:read',
  ],
  user: ['user:read', 'analytics:view', 'report:read', 'settings:read'],
  guest: [],
};

/**
 * 认证相关的 Cookie 和 Header 常量
 */
export const AUTH_CONSTANTS = {
  TOKEN_COOKIE: 'auth_token',
  REFRESH_TOKEN_COOKIE: 'refresh_token',
  TENANT_ID_HEADER: 'x-tenant-id',
  TOKEN_HEADER: 'authorization',
  TOKEN_PREFIX: 'Bearer ',
};

/**
 * 公开路由（不需要认证）
 */
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
];

/**
 * 仅管理员可访问的路由
 */
export const ADMIN_ROUTES = ['/admin', '/api/admin'];

/**
 * 受保护路由前缀
 */
export const PROTECTED_ROUTE_PREFIX = '/dashboard';

/**
 * 地域路由映射
 */
export const REGION_ROUTING: Record<string, string> = {
  'CN': '/dashboard/cn',
  'US': '/dashboard/us',
  'EU': '/dashboard/eu',
  'AP': '/dashboard/ap',
};
