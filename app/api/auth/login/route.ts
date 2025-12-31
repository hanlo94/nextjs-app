import { NextRequest, NextResponse } from 'next/server';
import { User, UserRole, Permission } from '@/types/auth';
import { AUTH_CONSTANTS } from '@/lib/auth-constants';

/**
 * 模拟用户数据库
 * 生产环境应使用真实数据库
 */
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@example.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      permissions: [
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
      ] as Permission[],
      tenantId: 'tenant-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  'user@example.com': {
    password: 'user123',
    user: {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      role: UserRole.USER,
      permissions: ['user:read', 'analytics:view', 'report:read', 'settings:read'] as Permission[],
      tenantId: 'tenant-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};

/**
 * 生成模拟 JWT Token
 */
function generateMockJWT(user: User): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    tenantId: user.tenantId,
    iat: now,
    exp: now + 24 * 60 * 60, // 24 小时
  };

  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64');

  // 签名（这是假签名，仅用于演示）
  const signature = Buffer.from(`mock-signature-${user.id}`).toString('base64');

  return `${header}.${payloadEncoded}.${signature}`;
}

/**
 * POST /api/auth/login
 * 用户登录
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: '邮箱和密码必填' }, { status: 400 });
    }

    // 查找用户
    const userRecord = MOCK_USERS[email];

    if (!userRecord || userRecord.password !== password) {
      return NextResponse.json({ message: '邮箱或密码错误' }, { status: 401 });
    }

    const user = userRecord.user;
    const token = generateMockJWT(user);

    // 创建响应
    const response = NextResponse.json(user, { status: 200 });

    // 设置 HttpOnly Cookie
    response.cookies.set(AUTH_CONSTANTS.TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 小时
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: '登录失败' }, { status: 500 });
  }
}
