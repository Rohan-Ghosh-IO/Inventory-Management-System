import { ROLES } from '../constants';
import { Role } from './roles';
import { PERMISSIONS, Permission } from './permissions';

/**
 * Role-to-Permission Mapping Matrix
 * ADMIN: Has all permissions
 * USER: Has view permissions & stock movement permissions only. Cannot create/edit/delete master records or export.
 */
const ROLE_PERMISSIONS: Record<Role, Set<Permission>> = {
  [ROLES.ADMIN]: new Set(Object.values(PERMISSIONS)),
  [ROLES.USER]: new Set([
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.CATEGORIES_VIEW,
    PERMISSIONS.SUPPLIERS_VIEW,
    PERMISSIONS.TRANSACTIONS_VIEW,
    PERMISSIONS.TRANSACTIONS_STOCK_IN,
    PERMISSIONS.TRANSACTIONS_STOCK_OUT,
  ]),
};

/**
 * Core permission check helper
 */
export function hasPermission(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.has(permission) : false;
}

/**
 * Reusable Helper Functions
 */
export function canCreateProducts(role: Role | undefined | null): boolean {
  return hasPermission(role, PERMISSIONS.PRODUCTS_CREATE);
}

export function canEditProducts(role: Role | undefined | null): boolean {
  return hasPermission(role, PERMISSIONS.PRODUCTS_EDIT);
}

export function canDeleteProducts(role: Role | undefined | null): boolean {
  return hasPermission(role, PERMISSIONS.PRODUCTS_DELETE);
}

export function canExport(role: Role | undefined | null): boolean {
  return hasPermission(role, PERMISSIONS.EXPORT_DATA) || hasPermission(role, PERMISSIONS.PRODUCTS_EXPORT);
}

export function canManageCategories(role: Role | undefined | null): boolean {
  return hasPermission(role, PERMISSIONS.CATEGORIES_CREATE);
}

export function canManageSuppliers(role: Role | undefined | null): boolean {
  return hasPermission(role, PERMISSIONS.SUPPLIERS_CREATE);
}

export function canManageInventory(role: Role | undefined | null): boolean {
  return (
    hasPermission(role, PERMISSIONS.TRANSACTIONS_STOCK_IN) &&
    hasPermission(role, PERMISSIONS.TRANSACTIONS_STOCK_OUT)
  );
}

export function canViewReports(role: Role | undefined | null): boolean {
  return hasPermission(role, PERMISSIONS.REPORTS_VIEW);
}

export function canViewAnalytics(role: Role | undefined | null): boolean {
  return hasPermission(role, PERMISSIONS.ANALYTICS_VIEW);
}
