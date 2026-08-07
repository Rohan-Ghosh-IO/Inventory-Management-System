import React from 'react';
import { Role } from '../../permissions/roles';
import { ROLES } from '../../constants';
import { Shield, User } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface RoleBadgeProps {
  role?: Role | string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role = ROLES.USER,
  size = 'sm',
  showIcon = true,
}) => {
  const isAdmin = role === ROLES.ADMIN;

  return (
    <Badge variant={isAdmin ? 'primary' : 'success'} size={size}>
      {showIcon && (
        isAdmin
          ? <Shield className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
          : <User className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      )}
      {isAdmin ? 'Administrator' : 'Inventory Staff'}
    </Badge>
  );
};
