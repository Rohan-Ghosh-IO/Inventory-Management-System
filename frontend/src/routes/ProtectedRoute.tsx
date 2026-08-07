import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { usePermissions } from '../hooks/usePermissions';
import { ROUTES } from '../constants';
import { Permission } from '../permissions/permissions';
import { Role } from '../permissions/roles';

interface ProtectedRouteProps {
  requiresPermission?: Permission;
  requiresRole?: Role;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiresPermission,
  requiresRole,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { can, role } = usePermissions();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (requiresRole && role !== requiresRole) {
    return <Navigate to="/403" replace />;
  }

  if (requiresPermission && !can(requiresPermission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};
