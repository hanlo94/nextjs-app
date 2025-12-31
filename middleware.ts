import { NextRequest, NextResponse } from 'next/server';
import { PUBLIC_ROUTES, ADMIN_ROUTES, AUTH_CONSTANTS, REGION_ROUTING } from '@/lib/auth-constants';

/**
 * 解析 JWT Token
 * 注意：这是简化版本，生产环境应使用 jsonwebtoken 库和验证签名
 */
function parseJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload;
  } catch {
    return null;
  }
}

/**
 * 检查 token 是否过期
 */
function isTokenExpired(payload: any): boolean {
  return payload.exp * 1000 < Date.now();
}

/**
 * 获取用户的区域位置（可从请求头或 GeoIP 获取）
 */
function getUserRegion(request: NextRequest): string {
  // 可从请求头获取
  const region = request.headers.get('x-region') || 'US';
  return region;
}

/**
 * Next.js Edge Middleware
 * 处理认证、多租户、地域路由、A/B 测试等
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. 检查是否为公开路由
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 2. 从 Cookie 获取 token
  const token = request.cookies.get(AUTH_CONSTANTS.TOKEN_COOKIE)?.value;

  // 如果没有 token，重定向到登录
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. 解析和验证 token
  const payload = parseJWT(token);

  if (!payload || isTokenExpired(payload)) {
    // token 过期，清除 cookie 并重定向到登录
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(AUTH_CONSTANTS.TOKEN_COOKIE);
    return response;
  }

  // 4. 检查管理员路由权限
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  // 5. 多租户上下文识别
  const tenantId = request.headers.get(AUTH_CONSTANTS.TENANT_ID_HEADER) || payload.tenantId;

  // 6. 地域路由处理
  const region = getUserRegion(request);
  const regionRoute = REGION_ROUTING[region];

  // 如果有区域特定的路由，可在此处理
  // 例如：将请求重定向到区域特定的 URL

  // 7. A/B 测试处理（可选）
  const abTestVariant = request.cookies.get('ab_test_variant')?.value || 'control';

  // 8. 构建响应，将上下文信息添加到请求头供应用使用
  const requestHeaders = new Headers(request.headers);

  // 添加用户信息
  requestHeaders.set('x-user-id', payload.sub);
  requestHeaders.set('x-user-email', payload.email);
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-user-permissions', JSON.stringify(payload.permissions));

  // 添加多租户信息
  requestHeaders.set(AUTH_CONSTANTS.TENANT_ID_HEADER, tenantId);

  // 添加地域信息
  requestHeaders.set('x-region', region);

  // 添加 A/B 测试信息
  requestHeaders.set('x-ab-variant', abTestVariant);

  // 添加 locale（可从不同来源获取）
  const locale = request.headers.get('accept-language')?.split(',')[0] || 'en';
  requestHeaders.set('x-locale', locale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

/**
 * 配置中间件运行的路径
 * 排除静态资源和 API 路由的某些部分
 */
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
