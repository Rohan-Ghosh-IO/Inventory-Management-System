import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ROUTES } from '../../constants';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Shield, User, ArrowLeft, PackageCheck, CheckCircle2, ChevronRight } from 'lucide-react';

const ADMIN_PERMS = [
  'Full inventory management',
  'Create, update & delete products',
  'Manage categories & suppliers',
  'Add stock transactions',
  'Export CSV & PDF reports',
  'Executive analytics & reports',
];

const USER_PERMS = [
  'View all inventory data',
  'Browse products & categories',
  'View supplier information',
  'Perform Stock In & Stock Out',
  'View transaction audit log',
  'Search & filter catalog',
];

export const RegisterRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSelect = (role: 'ADMIN' | 'USER') => {
    navigate(`/register/${role.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-surface flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-400/10 dark:bg-primary-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-success-400/10 dark:bg-success-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative w-full max-w-3xl">
        {/* Header bar: Back + ThemeToggle */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2 text-sm text-content-secondary hover:text-content transition-colors group font-medium"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to home
            </Link>
          </motion.div>
          <ThemeToggle size="sm" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/25 mb-4">
            <PackageCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-content dark:text-content tracking-tight mb-2">
            Choose Your Account Type
          </h1>
          <p className="text-content-secondary text-base max-w-md mx-auto">
            Select the role that matches your responsibilities. This determines your access level within the system.
          </p>
        </motion.div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <Card
              variant="glass"
              padding="lg"
              hover
              onClick={() => handleSelect('ADMIN')}
              className="group h-full flex flex-col justify-between border-border dark:border-border hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-950/30 text-primary-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Shield className="h-6 w-6" />
                  </div>
                  <Badge variant="primary" size="md">ADMIN</Badge>
                </div>

                <h2 className="text-xl font-bold text-content mb-1">Administrator</h2>
                <p className="text-sm text-content-secondary mb-6 leading-relaxed">
                  Full control over products, categories, suppliers, stock movements, and executive reports.
                </p>

                {/* Permissions list */}
                <ul className="space-y-2 mb-8">
                  {ADMIN_PERMS.map((p, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-content-secondary">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border">
                <span className="text-sm font-semibold text-primary-500 group-hover:text-primary-600 transition-colors flex items-center gap-1">
                  Continue as Administrator
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Card>
          </motion.div>

          {/* User Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <Card
              variant="glass"
              padding="lg"
              hover
              onClick={() => handleSelect('USER')}
              className="group h-full flex flex-col justify-between border-border dark:border-border hover:border-success-500/50 dark:hover:border-success-500/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="h-12 w-12 rounded-2xl bg-success-50 dark:bg-success-950/30 text-success-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <User className="h-6 w-6" />
                  </div>
                  <Badge variant="success" size="md">STAFF</Badge>
                </div>

                <h2 className="text-xl font-bold text-content mb-1">Inventory Staff</h2>
                <p className="text-sm text-content-secondary mb-6 leading-relaxed">
                  Operational access to perform Stock In and Stock Out movements and view catalog details.
                </p>

                {/* Permissions list */}
                <ul className="space-y-2 mb-8">
                  {USER_PERMS.map((p, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-content-secondary">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success-500 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border dark:border-border">
                <span className="text-sm font-semibold text-success-600 dark:text-success-400 group-hover:text-success-700 transition-colors flex items-center gap-1">
                  Continue as Staff
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sign in link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-content-secondary">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};
