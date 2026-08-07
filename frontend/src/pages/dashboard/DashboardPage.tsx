import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';

export const DashboardPage: React.FC = () => {
  const { isAdmin } = usePermissions();

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
};
