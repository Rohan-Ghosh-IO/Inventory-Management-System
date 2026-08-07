import { ROUTES, ROLES } from '../constants';
import { Role } from '../permissions/roles';
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  History,
  User,
  LucideIcon,
} from 'lucide-react';

export interface NavItemConfig {
  label: string;
  path: string;
  icon: LucideIcon;
  requiresAdmin?: boolean;
  badge?: string;
}

export const NAVIGATION_ITEMS: NavItemConfig[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Products',
    path: ROUTES.PRODUCTS,
    icon: Package,
  },
  {
    label: 'Categories',
    path: ROUTES.CATEGORIES,
    icon: Tags,
  },
  {
    label: 'Suppliers',
    path: ROUTES.SUPPLIERS,
    icon: Truck,
  },
  {
    label: 'Transactions',
    path: ROUTES.TRANSACTIONS,
    icon: History,
  },
  {
    label: 'Profile',
    path: ROUTES.PROFILE,
    icon: User,
  },
];

export function getNavItemsForRole(role: Role): NavItemConfig[] {
  return NAVIGATION_ITEMS.filter((item) => {
    if (item.requiresAdmin && role !== ROLES.ADMIN) {
      return false;
    }
    return true;
  });
}
