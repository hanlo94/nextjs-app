import { NextRequest, NextResponse } from 'next/server';
import { User, UserRole, Permission } from '@/types/auth';

/**
 * 模拟当前用户数据
 * 生产环境应从数据库查询
 */
const MOCK_USER: User = {
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
};

/**
 * GET /api/auth/me
 * 获取当前用户信息
 * 由 middleware 检查 JWT token，如果有效则允许访问
 */
export async function GET(request: NextRequest) {
  try {
    // 从请求头获取用户信息（由 middleware 注入）
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ message: '未认证' }, { status: 401 });
    }

    // 在实际应用中，应该根据 userId 从数据库查询用户信息
    // 这里使用模拟用户
    return NextResponse.json(MOCK_USER);
  } catch (error) {
    return NextResponse.json({ message: '获取用户信息失败' }, { status: 500 });
  }
}
