# 路由与权限实现指南

## 概述

本项目实现了完整的路由保护与权限管理系统，包括：

1. **中间件认证** - 通过 Next.js middleware 进行 JWT 验证
2. **路由分层** - 使用 Route Groups 组织公开和受保护路由
3. **状态管理** - 使用 Zustand 管理认证状态
4. **权限检查** - 提供 Hook 和高阶组件进行权限验证

## 目录结构

```
app/
├── (public)/              # 公开区域 - 无需认证
│   ├── layout.tsx         # 公开布局
│   ├── login/page.tsx     # 登录页
│   └── register/page.tsx  # 注册页
├── (dashboard)/           # 受保护区域 - 需要认证
│   ├── layout.tsx         # 仪表盘布局
│   ├── page.tsx           # 首页
│   ├── analytics/page.tsx # 分析页
│   ├── reports/page.tsx   # 报表页
│   └── users/page.tsx     # 用户管理页
├── api/
│   └── auth/
│       ├── login/route.ts # 登录接口
│       ├── logout/route.ts # 登出接口
│       └── me/route.ts     # 获取当前用户
└── middleware.ts          # 全局中间件

src/
├── types/
│   └── auth.ts           # 认证相关类型定义
├── lib/
│   ├── auth-constants.ts # 认证常量
│   └── withAuth.tsx      # 认证 HOC
├── hooks/
│   ├── useAuth.ts        # 认证 Hook
│   └── usePermission.ts  # 权限 Hook
└── store/
    └── useAuthStore.ts   # Zustand 认证 Store
```

## 使用方式

### 1. 检查认证状态

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>请登录</div>;
  }

  return <div>欢迎，{user?.name}！</div>;
}
```

### 2. 页面级认证保护

```tsx
import { withAuth } from '@/lib/withAuth';
import { UserRole } from '@/types/auth';

function AdminPage() {
  return <div>仅管理员可见</div>;
}

export default withAuth(AdminPage, {
  requiredRoles: [UserRole.ADMIN],
});
```

### 3. 细粒度权限检查

```tsx
'use client';

import { usePermission, CanAccess } from '@/hooks/usePermission';

export default function ReportPage() {
  const { hasPermission, can } = usePermission();

  // 方法 1：使用 Hook
  if (!hasPermission('report:read')) {
    return <div>无权限</div>;
  }

  // 方法 2：使用组件
  return (
    <div>
      <CanAccess permission="report:create">
        <button>创建报表</button>
      </CanAccess>

      <CanAccess permission="report:delete" fallback={<div>无删除权限</div>}>
        <button>删除报表</button>
      </CanAccess>
    </div>
  );
}
```

### 4. 角色检查

```tsx
'use client';

import { usePermission, CanAccess } from '@/hooks/usePermission';

export default function UserManagement() {
  const { isRole, isAnyRole } = usePermission();

  // 检查特定角色
  if (!isRole('admin')) {
    return <div>仅管理员可访问</div>;
  }

  // 检查多个角色
  return (
    <CanAccess role={['admin', 'manager']}>
      <div>仅管理员和经理可见</div>
    </CanAccess>
  );
}
```

## 认证流程

### 登录流程

```
1. 用户在登录页输入邮箱和密码
   ↓
2. 提交到 POST /api/auth/login
   ↓
3. 服务器验证密码，生成 JWT Token
   ↓
4. Token 写入 HttpOnly Cookie
   ↓
5. 用户信息存储到 Zustand Store
   ↓
6. 重定向到 /dashboard
```

### 请求流程

```
1. 用户请求受保护页面
   ↓
2. middleware.ts 拦截请求
   ↓
3. 从 Cookie 读取 JWT Token
   ↓
4. 验证 Token 有效性和过期时间
   ↓
5. 将用户信息和上下文注入到请求头
   ↓
6. 如果验证失败，重定向到登录页
```

## 权限系统

### 角色与权限映射

```typescript
admin: [
  'user:create', 'user:read', 'user:update', 'user:delete',
  'analytics:view', 'analytics:export',
  'report:create', 'report:read', 'report:update', 'report:delete',
  'settings:read', 'settings:update',
]

manager: [
  'user:read', 'user:update',
  'analytics:view', 'analytics:export',
  'report:create', 'report:read', 'report:update',
  'settings:read',
]

user: [
  'user:read',
  'analytics:view',
  'report:read',
  'settings:read',
]

guest: []
```

### 权限操作

```typescript
const { 
  hasPermission,           // 检查单个权限
  hasAnyPermission,        // 检查任意权限（OR）
  hasAllPermissions,       // 检查所有权限（AND）
  can,                     // 通用权限检查
  isRole,                  // 检查特定角色
  isAnyRole,               // 检查任意角色
  getPermissions,          // 获取所有权限列表
  getRole,                 // 获取用户角色
} = usePermission();
```

## 多租户支持

中间件自动处理多租户上下文：

```typescript
// 从请求头获取租户 ID
const tenantId = request.headers.get('x-tenant-id');

// 将租户信息注入到请求头供应用使用
requestHeaders.set('x-tenant-id', tenantId);
```

## 地域路由

根据用户所在地域自动路由：

```typescript
// 地域映射
{
  'CN': '/dashboard/cn',
  'US': '/dashboard/us',
  'EU': '/dashboard/eu',
  'AP': '/dashboard/ap',
}
```

## A/B 测试

中间件支持 A/B 测试变体识别：

```typescript
const abTestVariant = request.cookies.get('ab_test_variant')?.value || 'control';
requestHeaders.set('x-ab-variant', abTestVariant);
```

## 测试凭证

### 管理员账户

- 邮箱: `admin@example.com`
- 密码: `admin123`
- 权限: 所有权限

### 普通用户

- 邮箱: `user@example.com`
- 密码: `user123`
- 权限: 读取权限

## 生产环节清单

- [ ] 用真实的 JWT 签名算法替换模拟签名
- [ ] 实现真实的用户数据库查询
- [ ] 启用 HTTPS 并设置 `secure: true` for cookies
- [ ] 实现 Token 刷新机制
- [ ] 添加 CSRF 保护
- [ ] 实现会话超时和自动登出
- [ ] 添加审计日志
- [ ] 实现密码加密（bcrypt）
- [ ] 设置速率限制防止暴力破解
- [ ] 配置 CORS 策略

## 相关文件

- [认证类型定义](../src/types/auth.ts)
- [认证常量](../src/lib/auth-constants.ts)
- [认证 Store](../src/store/useAuthStore.ts)
- [认证 Hooks](../src/hooks/useAuth.ts)
- [权限 Hooks](../src/hooks/usePermission.ts)
- [认证 HOC](../src/lib/withAuth.tsx)
- [中间件](../middleware.ts)
