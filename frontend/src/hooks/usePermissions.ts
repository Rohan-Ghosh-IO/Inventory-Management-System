import { useAppSelector } from './useAppSelector';
import { ROLES } from '../constants';
import { Role, ROLE_CONFIGS, RoleConfig } from '../permissions/roles';
import { Permission } from '../permissions/permissions';
import {
  hasPermission,
  canCreateProducts,
  canEditProducts,
  canDeleteProducts,
  canExport,
  canManageCategories,
  canManageSuppliers,
  canManageInventory,
  canViewReports,
  canViewAnalytics,
} from '../permissions/ability';

export function usePermissions() {
  const { user } = useAppSelector((state) => state.auth);
  const role: Role = (user?.role as Role) || ROLES.USER;
  const isAdmin = role === ROLES.ADMIN;
  const isUser = role === ROLES.USER;

  const roleConfig: RoleConfig = ROLE_CONFIGS[role] || ROLE_CONFIGS[ROLES.USER];

  return {
    user,
    role,
    isAdmin,
    isUser,
    roleConfig,
    can: (permission: Permission) => hasPermission(role, permission),
    canCreateProducts: canCreateProducts(role),
    canEditProducts: canEditProducts(role),
    canDeleteProducts: canDeleteProducts(role),
    canExport: canExport(role),
    canManageCategories: canManageCategories(role),
    canManageSuppliers: canManageSuppliers(role),
    canManageInventory: canManageInventory(role),
    canViewReports: canViewReports(role),
    canViewAnalytics: canViewAnalytics(role),
  };
}
