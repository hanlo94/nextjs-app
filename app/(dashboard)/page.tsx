'use client';

import { useAuth } from '@/hooks/useAuth';
import { CanAccess } from '@/hooks/usePermission';
import Link from 'next/link';

/**
 * 仪表盘首页
 */
export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">欢迎，{user?.name}！</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* 统计卡片 */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-gray-600 text-sm font-medium mb-2">总用户</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-gray-600 text-sm font-medium mb-2">活跃用户</h3>
          <p className="text-3xl font-bold text-green-600">567</p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-gray-600 text-sm font-medium mb-2">转化率</h3>
          <p className="text-3xl font-bold text-purple-600">45.8%</p>
        </div>
      </div>

      {/* 权限检查示例 */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">操作面板</h2>

        <div className="space-y-4">
          {/* 所有用户都能看到 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">📊 查看分析数据 (所有人)</p>
          </div>

          {/* 仅有 analytics:view 权限的用户可见 */}
          <CanAccess permission="analytics:view" fallback={<p className="text-gray-400">无权限查看高级分析</p>}>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700">📈 高级分析 (需要 analytics:view 权限)</p>
              <Link href="/dashboard/analytics" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                进入分析页面 →
              </Link>
            </div>
          </CanAccess>

          {/* 仅管理员可见 */}
          <CanAccess role="admin" fallback={<p className="text-gray-400">仅管理员可访问</p>}>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700">👨‍💼 用户管理 (仅管理员)</p>
              <Link href="/dashboard/users" className="text-red-600 hover:underline text-sm mt-2 inline-block">
                管理用户 →
              </Link>
            </div>
          </CanAccess>

          {/* 多权限检查 */}
          <CanAccess
            permission={['report:create', 'report:read']}
            fallback={<p className="text-gray-400">无权限创建报表</p>}
          >
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700">📋 报表管理 (需要报表权限)</p>
              <Link href="/dashboard/reports" className="text-green-600 hover:underline text-sm mt-2 inline-block">
                查看报表 →
              </Link>
            </div>
          </CanAccess>
        </div>
      </div>

      {/* 用户信息 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">当前用户信息</h3>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-medium text-gray-600">邮箱:</dt>
            <dd className="text-gray-900">{user?.email}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600">角色:</dt>
            <dd className="text-gray-900">{user?.role}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600">租户 ID:</dt>
            <dd className="text-gray-900 font-mono text-xs">{user?.tenantId}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-600">权限:</dt>
            <dd className="text-gray-900">
              <ul className="list-disc list-inside mt-2 space-y-1">
                {user?.permissions.map((perm) => (
                  <li key={perm} className="text-xs">
                    {perm}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
