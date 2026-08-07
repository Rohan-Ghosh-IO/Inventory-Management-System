import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileQuestion, LayoutDashboard } from 'lucide-react';
import { ROUTES } from '../../constants';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        <Card padding="lg" className="text-center shadow-2xl relative overflow-hidden">
          {/* Glowing background accent */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-warning-500/10 rounded-full blur-3xl" />

          <div className="relative space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="mx-auto h-20 w-20 rounded-2xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-900/50 flex items-center justify-center text-primary-500 mb-2"
            >
              <FileQuestion className="h-10 w-10" />
            </motion.div>

            <Badge variant="primary" size="md">
              Error 404
            </Badge>

            <h1 className="text-3xl font-extrabold text-content tracking-tight">
              Page Not Found
            </h1>

            <p className="text-content-secondary text-sm leading-relaxed max-w-md mx-auto">
              The page you are looking for doesn't exist or has been moved. Check the URL or return to the main dashboard.
            </p>

            <div className="pt-4 flex justify-center">
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="primary" size="md" icon={LayoutDashboard}>
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
