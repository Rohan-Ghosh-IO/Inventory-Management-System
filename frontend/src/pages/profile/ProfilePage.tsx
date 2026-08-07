import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { usePermissions } from '../../hooks/usePermissions';
import { logoutUser } from '../../features/auth/auth.slice';
import { RoleBadge } from '../../components/common/RoleBadge';
import { PageHeader } from '../../components/ui/PageHeader';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { ChangePasswordModal } from '../../components/profile/ChangePasswordModal';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  LogOut,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Sparkles,
  Key,
  Activity,
  Crown,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, roleConfig, isAdmin } = usePermissions();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const adminPermissions = [
    'Create, update, and delete products',
    'Manage product categories and suppliers',
    'Execute Stock In and Stock Out movements',
    'Export CSV spreadsheets and PDF reports',
    'Access real-time inventory analytics & audit feeds',
  ];

  const userPermissions = [
    'View all products, categories, and suppliers',
    'Execute Stock Inward (Add Stock)',
    'Execute Stock Outward (Issue Stock)',
    'View real-time stock transaction audit history',
    'Search and filter inventory items',
  ];

  const activePermissions = isAdmin ? adminPermissions : userPermissions;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <PageHeader
        title="User Profile"
        description="Manage your account credentials, view role permissions, and active session details."
        icon={User}
        badge={<RoleBadge role={user?.role} size="md" />}
      />

      {/* Main Glassmorphic Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-[#121212]/90 backdrop-blur-xl p-8 shadow-2xl"
      >
        {/* Banner Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-500 via-emerald-500 to-indigo-500" />

        {/* User Hero Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-border/60 dark:border-border/40">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-1 rounded-2xl bg-gradient-to-tr from-primary-500 to-emerald-400 shadow-lg shadow-primary-500/20">
                <Avatar name={user?.name || 'User'} size="xl" isAdmin={isAdmin} />
              </div>
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#121212] shadow-sm animate-pulse" title="Active Session" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-content tracking-tight">
                  {user?.name || 'User Name'}
                </h2>
                <RoleBadge role={user?.role} size="md" />
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-content-secondary">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-secondary dark:bg-[#1C1C1C] border border-border/60 dark:border-border/40">
                  <Mail className="h-3.5 w-3.5 text-primary-500" />
                  {user?.email || 'user@inventory.com'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                  <Activity className="h-3.5 w-3.5 text-emerald-500" />
                  Session Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              icon={Key}
              onClick={() => setIsPasswordModalOpen(true)}
              className="flex-1 sm:flex-initial shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Change Password
            </Button>
            <Button
              variant="danger"
              size="md"
              icon={LogOut}
              onClick={handleLogout}
              className="flex-1 sm:flex-initial shadow-lg shadow-danger-500/15 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Equal-Height Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 items-stretch">
          {/* Account Information */}
          <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-content-tertiary">
                Account Information
              </h3>
            </div>

            <div className="flex-1 p-5 rounded-2xl bg-surface-secondary/70 dark:bg-[#1A1A1A] border border-border/80 dark:border-border/40 flex flex-col justify-between space-y-3.5 shadow-sm">
              <div className="flex justify-between items-center text-sm py-1">
                <span className="text-content-secondary font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-content-tertiary" /> User Name
                </span>
                <span className="font-bold text-content">
                  {user?.name || 'User Name'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm py-1 border-t border-border/40 dark:border-border/20 pt-3">
                <span className="text-content-secondary font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-content-tertiary" /> Email Address
                </span>
                <span className="font-medium text-content font-mono text-xs">
                  {user?.email || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm py-1 border-t border-border/40 dark:border-border/20 pt-3">
                <span className="text-content-secondary font-medium flex items-center gap-2">
                  <Crown className="h-4 w-4 text-content-tertiary" /> System Role
                </span>
                <span className="font-bold text-primary-600 dark:text-primary-400">
                  {roleConfig.displayName}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm py-1 border-t border-border/40 dark:border-border/20 pt-3">
                <span className="text-content-secondary font-medium flex items-center gap-2">
                  <Lock className="h-4 w-4 text-content-tertiary" /> Security Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Secured & Authenticated
                </span>
              </div>
            </div>
          </div>

          {/* Role Capabilities */}
          <div className="flex flex-col h-full space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-content-tertiary">
                Role Capabilities & Access
              </h3>
            </div>

            <div className="flex-1 p-5 rounded-2xl bg-surface-secondary/70 dark:bg-[#1A1A1A] border border-border/80 dark:border-border/40 flex flex-col justify-around space-y-3 shadow-sm">
              {activePermissions.map((perm, index) => (
                <div key={index} className="flex items-center gap-3 text-xs text-content-secondary p-1">
                  <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isAdmin ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-500' : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500'
                  }`}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-medium text-content">{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
};

