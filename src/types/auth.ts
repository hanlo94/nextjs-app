/**
 * 从根目录 types 重新导出
 * 支持在 src/ 下的文件中导入
 */
export { UserRole, Permission, type User, type AuthContext, type JWTPayload, type TenantContext, type RequestContext } from '@/types/auth';
