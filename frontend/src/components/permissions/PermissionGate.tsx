import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { Permission } from '../../permissions/permissions';
import { Role } from '../../permissions/roles';

interface PermissionGateProps {
  permission?: Permission;
  requiresRole?: Role;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  requiresRole,
  fallback = null,
  children,
}) => {
  const { can, role } = usePermissions();

  if (requiresRole && role !== requiresRole) {
    return <>{fallback}</>;
  }

  if (permission && !can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
