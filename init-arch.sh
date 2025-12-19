#!/bin/bash

echo "🚀 开始构建企业级 Next.js 架构..."

# 1. 创建核心目录结构 (App Router 模式)
mkdir -p src/{components,features,hooks,lib,services,store,types,utils}

# 2. 在 features 目录下创建示例模块 (Domain-Driven)
mkdir -p src/features/auth/{components,hooks,services,types}
mkdir -p src/features/user-profile/{components,hooks,services,types}

# 3. 创建基础 UI 组件目录 (原子设计原则)
mkdir -p src/components/{ui,layout,common}

# 4. 初始化基础配置文件
# 创建 Axios 实例配置
cat <<EOF > src/lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default api;
EOF

# 创建 Zustand 基础 Store 示例
cat <<EOF > src/store/useUserStore.ts
import { create } from 'zustand';

interface UserState {
  user: any;
  setUser: (user: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
EOF

# 5. 创建基础环境变量模板
echo "NEXT_PUBLIC_API_URL=https://api.example.com" > .env.example
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

# 6. 配置 Prettier
cat <<EOF > .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
EOF

echo "✅ 目录结构与基础配置初始化完成！"