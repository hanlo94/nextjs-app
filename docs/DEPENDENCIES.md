# 项目依赖说明

## 生产依赖 (dependencies)

### UI 框架 & 基础
- **next** - Next.js 框架，提供 App Router、SSR、ISR 等能力
- **react** - React 库，UI 框架基础
- **react-dom** - React DOM 渲染器

### 状态管理
- **zustand** - 轻量级状态管理库，用于本地状态管理
- **@tanstack/react-query** - TanStack Query，服务端状态管理和数据同步
- **next-intl** - Next.js 国际化解决方案，支持 SSR

### 样式系统
- **tailwindcss** - 原子化 CSS 框架
- **@tailwindcss/typography** - Tailwind 排版插件
- **@tailwindcss/forms** - Tailwind 表单样式插件
- **class-variance-authority** - 组件变体管理工具
- **clsx** - 条件类名拼接工具
- **tailwind-merge** - Tailwind CSS 类名合并工具

### 表单与验证
- **react-hook-form** - 高性能表单库
- **zod** - TypeScript 首选的 schema 验证库

### 数据可视化
- **recharts** - React 图表库
- **echarts** - Apache ECharts，功能强大的图表库

### API 与网络
- **axios** - HTTP 客户端库

### UI 组件库
- **@radix-ui/react-slot** - Radix UI 的 Slot 组件
- **lucide-react** - 图标库

### 可观测性
- **@sentry/react** - Sentry 错误追踪库
- **@sentry/tracing** - Sentry 分布式追踪
- **@opentelemetry/api** - OpenTelemetry 核心 API
- **@opentelemetry/sdk-node** - OpenTelemetry Node.js SDK

### 安全
- **helmet** - HTTP 安全头设置库
- **eslint-plugin-react-hooks** - React Hooks ESLint 规则

### 其他
- **add** - npm install 简化工具

---

## 开发依赖 (devDependencies)

### 类型检查
- **typescript** - TypeScript 语言支持

### 测试框架
- **vitest** - Vite 原生的单元测试框架
- **@vitest/ui** - Vitest UI 可视化面板
- **@playwright/test** - Playwright 端到端测试框架
- **playwright** - 浏览器自动化工具

### 测试辅助
- **@testing-library/react** - React 组件测试库
- **@testing-library/jest-dom** - Jest DOM 匹配器扩展

### 代码质量
- **eslint** - JavaScript linter
- **eslint-config-next** - Next.js ESLint 配置
- **biome** - Rust 编写的代码格式化和 linter

### 组件文档
- **storybook** - 组件故事书，组件驱动开发
- **@storybook/react** - Storybook React 适配器

### 构建工具
- **@tailwindcss/postcss** - Tailwind CSS v4 PostCSS 插件

### 类型定义
- **@types/node** - Node.js 类型定义
- **@types/react** - React 类型定义
- **@types/react-dom** - React DOM 类型定义
