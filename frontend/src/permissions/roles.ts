import { ROLES } from '../constants';
import { Shield, User } from 'lucide-react';

export type Role = typeof ROLES[keyof typeof ROLES];

export interface RoleConfig {
  name: Role;
  displayName: string;
  badgeLabel: string;
  color: 'blue' | 'green';
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  glowColor: string;
  icon: typeof Shield;
  description: string;
}

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  [ROLES.ADMIN]: {
    name: ROLES.ADMIN,
    displayName: 'Administrator',
    badgeLabel: 'Administrator',
    color: 'blue',
    badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    badgeText: 'text-indigo-600 dark:text-indigo-300',
    badgeBorder: 'border-indigo-500/30',
    glowColor: 'shadow-indigo-500/20',
    icon: Shield,
    description: 'Full administrative access to manage products, categories, suppliers, transactions, and executive reports.',
  },
  [ROLES.USER]: {
    name: ROLES.USER,
    displayName: 'Inventory Staff',
    badgeLabel: 'Inventory Staff',
    color: 'green',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeText: 'text-emerald-600 dark:text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
    icon: User,
    description: 'Operational access for inventory stock movements, stock queries, and daily warehouse management.',
  },
};
