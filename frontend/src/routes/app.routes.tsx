import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ProtectedRoute } from './ProtectedRoute';
import { NavigationLayout } from '../components/layout/NavigationLayout';
import { PageSkeleton } from '../components/skeleton/Skeletons';
import { ROUTES, ROLES } from '../constants';

// Lazy Loaded Route Components for Code Splitting & Performance Optimization
const LandingPage = lazy(() => import('../pages/auth/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterRolePage = lazy(() => import('../pages/auth/RegisterRolePage').then((m) => ({ default: m.RegisterRolePage })));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const ProductListPage = lazy(() => import('../pages/products/ProductListPage').then((m) => ({ default: m.ProductListPage })));
const CategoryListPage = lazy(() => import('../pages/categories/CategoryListPage').then((m) => ({ default: m.CategoryListPage })));
const SupplierListPage = lazy(() => import('../pages/suppliers/SupplierListPage').then((m) => ({ default: m.SupplierListPage })));
const TransactionHistoryPage = lazy(() => import('../pages/transactions/TransactionHistoryPage').then((m) => ({ default: m.TransactionHistoryPage })));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const AccessDeniedPage = lazy(() => import('../pages/error/AccessDeniedPage').then((m) => ({ default: m.AccessDeniedPage })));
const NotFoundPage = lazy(() => import('../pages/error/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.18, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
  >
    {children}
  </motion.div>
);

export const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageSkeleton />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Auth Routes */}
          <Route path={ROUTES.HOME} element={<PageTransition><LandingPage /></PageTransition>} />
          <Route path={ROUTES.LOGIN} element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path={ROUTES.REGISTER_ROLE} element={<PageTransition><RegisterRolePage /></PageTransition>} />
          <Route path={ROUTES.REGISTER} element={<PageTransition><RegisterPage /></PageTransition>} />

          {/* Protected Base Routes (All Roles) */}
          <Route element={<ProtectedRoute />}>
            <Route
              path={ROUTES.DASHBOARD}
              element={<PageTransition><NavigationLayout><DashboardPage /></NavigationLayout></PageTransition>}
            />
            <Route
              path={ROUTES.PRODUCTS}
              element={<PageTransition><NavigationLayout><ProductListPage /></NavigationLayout></PageTransition>}
            />
            <Route
              path={ROUTES.CATEGORIES}
              element={<PageTransition><NavigationLayout><CategoryListPage /></NavigationLayout></PageTransition>}
            />
            <Route
              path={ROUTES.SUPPLIERS}
              element={<PageTransition><NavigationLayout><SupplierListPage /></NavigationLayout></PageTransition>}
            />
            <Route
              path={ROUTES.TRANSACTIONS}
              element={<PageTransition><NavigationLayout><TransactionHistoryPage /></NavigationLayout></PageTransition>}
            />
            <Route
              path={ROUTES.PROFILE}
              element={<PageTransition><NavigationLayout><ProfilePage /></NavigationLayout></PageTransition>}
            />
          </Route>

          {/* Error Routes */}
          <Route path="/403" element={<PageTransition><AccessDeniedPage /></PageTransition>} />
          <Route path="/404" element={<PageTransition><NotFoundPage /></PageTransition>} />

          {/* Fallback Catch-all 404 */}
          <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};
