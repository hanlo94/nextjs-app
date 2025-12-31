'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

/**
 * 受保护区域 Layout
 * 仅用于已认证用户的仪表盘等页面
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              Dashboard
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/dashboard/analytics"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                分析
              </Link>
              <Link
                href="/dashboard/reports"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                报表
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                设置
              </Link>
            </div>
          </div>

          {/* 用户菜单 */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {user?.name} <span className="text-xs text-gray-500">({user?.role})</span>
            </span>
            <button
              onClick={() => logout()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
            >
              退出登录
            </button>
          </div>
        </div>
      </nav>

      {/* 侧边栏 + 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-4">
          {/* 侧边栏 */}
          <aside className="col-span-3 hidden md:block">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">菜单</h3>
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100"
                >
                  首页
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100"
                >
                  数据分析
                </Link>
                <Link
                  href="/dashboard/reports"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100"
                >
                  报表
                </Link>
                <Link
                  href="/dashboard/users"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100"
                >
                  用户管理
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 rounded hover:bg-gray-100"
                >
                  设置
                </Link>
              </nav>
            </div>
          </aside>

          {/* 主内容区域 */}
          <main className="col-span-12 md:col-span-9">
            <div className="bg-white rounded-lg shadow p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
