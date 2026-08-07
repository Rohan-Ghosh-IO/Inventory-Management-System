import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logoutUser } from '../../features/auth/auth.slice';
import { getNavItemsForRole } from '../../navigation/navigation.config';
import { RoleBadge } from '../common/RoleBadge';
import { ThemeToggle } from '../common/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { ROUTES } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PackageCheck,
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  ChevronRight,
  Home,
  Sparkles,
} from 'lucide-react';

interface NavigationLayoutProps {
  children: React.ReactNode;
}

export const NavigationLayout: React.FC<NavigationLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, isAdmin } = usePermissions();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = getNavItemsForRole(role);
  const currentPageLabel = navItems.find((item) => item.path === location.pathname)?.label || 'Page';

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
  }, [dispatch, navigate]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Sidebar content — shared between desktop and mobile
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border dark:border-border flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white flex-shrink-0">
          <PackageCheck className="h-4 w-4" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="font-bold text-sm text-content tracking-tight whitespace-nowrap overflow-hidden"
            >
              IMS
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              title={collapsed ? item.label : undefined}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150
                ${isActive
                  ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400'
                  : 'text-content-secondary hover:text-content hover:bg-surface-tertiary dark:hover:bg-surface-tertiary'
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-500 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${isActive ? 'text-primary-500' : 'text-content-tertiary group-hover:text-content-secondary'}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border dark:border-border p-3 space-y-2 flex-shrink-0">
        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[13px] font-medium text-content-tertiary hover:text-content-secondary hover:bg-surface-tertiary dark:hover:bg-surface-tertiary transition-colors"
        >
          {collapsed ? <ChevronsRight className="h-[18px] w-[18px] flex-shrink-0" /> : <ChevronsLeft className="h-[18px] w-[18px] flex-shrink-0" />}
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[13px] font-medium text-content-tertiary hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-950/30 transition-colors"
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface dark:bg-surface flex font-sans">
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col flex-shrink-0
          bg-white dark:bg-[#0F0F0F]
          border-r border-border dark:border-border
          transition-[width] duration-200 ease-in-out
          ${collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'}
          fixed top-0 left-0 h-screen z-30
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed top-0 left-0 h-screen w-sidebar bg-white dark:bg-[#0F0F0F] border-r border-border dark:border-border z-50"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-[margin] duration-200 ease-in-out ${collapsed ? 'md:ml-sidebar-collapsed' : 'md:ml-sidebar'}`}>
        {/* Topbar Header */}
        <header className="sticky top-0 z-20 h-16 flex-shrink-0 bg-white/85 dark:bg-[#09090B]/85 backdrop-blur-xl border-b border-border/80 dark:border-white/10 shadow-subtle transition-colors">
          {/* Subtle Top Gradient Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500 via-emerald-400 to-indigo-500" />

          <div className="h-full px-4 sm:px-6 flex items-center justify-between">
            {/* Left: Mobile menu toggle + Fancy breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-content-secondary hover:text-content hover:bg-surface-tertiary dark:hover:bg-white/5 transition-all"
                aria-label="Toggle navigation"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Fancy Breadcrumb Navigation */}
              <div className="hidden sm:flex items-center gap-2.5 text-xs">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-secondary dark:bg-white/5 border border-border/60 dark:border-white/10 text-content-secondary hover:text-primary-500 font-semibold transition-all hover:scale-[1.02]"
                >
                  <Home className="h-3.5 w-3.5 text-primary-500" />
                  <span>IMS</span>
                </Link>

                <ChevronRight className="h-3.5 w-3.5 text-content-tertiary" />

                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/40 border border-primary-200/60 dark:border-primary-900/40 text-primary-600 dark:text-primary-400 font-bold capitalize shadow-xs">
                  <Sparkles className="h-3 w-3 text-primary-500" />
                  {currentPageLabel}
                </span>
              </div>
            </div>

            {/* Right: Theme toggle + Fancy User profile pill */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <ThemeToggle size="sm" />

              <div className="h-5 w-px bg-border/80 dark:bg-white/10 hidden sm:block" />

              {user && (
                <Link
                  to={ROUTES.PROFILE}
                  className="group flex items-center gap-2 sm:gap-3 p-1 sm:p-1.5 pl-2.5 sm:pl-3.5 rounded-2xl bg-surface-secondary/80 dark:bg-[#161618] border border-border/80 dark:border-white/10 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all shadow-sm hover:shadow-md"
                  title="View Profile Settings"
                >
                  <div className="hidden md:block text-right">
                    <p className="text-xs font-extrabold text-content group-hover:text-primary-500 transition-colors leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <div className="mt-0.5">
                      <RoleBadge role={user.role} size="sm" showIcon={false} />
                    </div>
                  </div>

                  <div className="relative flex-shrink-0">
                    <div className="p-0.5 rounded-xl bg-gradient-to-tr from-primary-500 to-emerald-400 shadow-sm group-hover:scale-105 transition-transform">
                      <Avatar name={user.name} size="sm" isAdmin={isAdmin} />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#161618] shadow-xs" title="Online Active Session" />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
