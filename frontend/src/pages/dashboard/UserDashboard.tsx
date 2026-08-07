import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchDashboardData } from '../../features/dashboard/dashboard.slice';
import { fetchProducts } from '../../features/products/product.slice';
import { RoleBadge } from '../../components/common/RoleBadge';
import { StockInModal } from '../../components/transactions/StockInModal';
import { StockOutModal } from '../../components/transactions/StockOutModal';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CardSkeleton } from '../../components/skeleton/Skeletons';
import {
  Package,
  Boxes,
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  PlusCircle,
  MinusCircle,
  LayoutDashboard,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { summary, lowStockProducts, recentTransactions, loading } = useAppSelector(
    (state) => state.dashboard
  );
  const productsState = useAppSelector((state) => state.products);

  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchProducts({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleStockSuccess = () => {
    dispatch(fetchDashboardData());
    dispatch(fetchProducts({ page: 1, limit: 100 }));
  };

  // Calculate operational stats
  const totalAvailableStockUnits = productsState.items.reduce(
    (acc, p) => acc + (p.quantity || 0),
    0
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Operational Header */}
      <PageHeader
        title="Operational Staff Dashboard"
        description="Day-to-day warehouse operations, quick stock movements, and low stock alert management."
        icon={LayoutDashboard}
        badge={<RoleBadge role="USER" size="md" />}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="success"
              size="sm"
              icon={PlusCircle}
              onClick={() => setIsStockInOpen(true)}
            >
              Stock Inward (+ Add)
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={MinusCircle}
              onClick={() => setIsStockOutOpen(true)}
            >
              Stock Outward (- Issue)
            </Button>
          </div>
        }
      />

      {/* Operational Metric Cards (NO Financial metrics for Staff) */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Products"
            value={summary?.totalProducts || 0}
            icon={Package}
            iconColor="text-primary-500"
            iconBg="bg-primary-50 dark:bg-primary-950/30"
            subtitle="Catalog items in warehouse"
          />

          <StatsCard
            label="Total Available Units"
            value={totalAvailableStockUnits.toLocaleString()}
            icon={Boxes}
            iconColor="text-success-500"
            iconBg="bg-success-50 dark:bg-success-950/30"
            subtitle="Physical units on shelf"
          />

          <StatsCard
            label="Low Stock Alerts"
            value={summary?.lowStockProducts || 0}
            icon={AlertTriangle}
            iconColor="text-warning-500"
            iconBg="bg-warning-50 dark:bg-warning-950/30"
            subtitle="Requires restocking"
            variant="warning"
          />

          <StatsCard
            label="Out of Stock"
            value={summary?.outOfStockProducts || 0}
            icon={Clock}
            iconColor="text-danger-500"
            iconBg="bg-danger-50 dark:bg-danger-950/30"
            subtitle="Zero inventory available"
            variant="danger"
          />
        </div>
      )}

      {/* Operational Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Action Center */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-content text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning-500" />
              Low Stock Action Center
            </h3>
            <span className="text-xs font-semibold text-warning-700 dark:text-warning-400 bg-warning-50 dark:bg-warning-950/50 px-2.5 py-1 rounded-full border border-warning-200 dark:border-warning-900">
              Immediate Action Required
            </span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {lowStockProducts && lowStockProducts.length > 0 ? (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-warning-50/50 dark:bg-warning-950/20 border border-warning-200/60 dark:border-warning-900/40"
                >
                  <div>
                    <p className="text-xs font-bold text-content">{p.productName}</p>
                    <p className="text-[11px] text-content-tertiary font-mono">SKU: {p.sku}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-warning-700 dark:text-warning-400 block">
                        {p.quantity} left
                      </span>
                      <span className="text-[10px] text-content-tertiary">Min threshold: {p.lowStockThreshold}</span>
                    </div>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => setIsStockInOpen(true)}
                    >
                      + Add Stock
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-content-tertiary text-xs flex flex-col items-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-success-500" />
                <span>All items are sufficiently stocked above minimum threshold.</span>
              </div>
            )}
          </div>
        </Card>

        {/* Live Operational Movement Feed */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-content text-base flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-500" />
              Live Stock Audit Movement Feed
            </h3>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {recentTransactions?.slice(0, 6).map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-secondary dark:bg-[#1A1A1A] border border-border-secondary dark:border-border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      txn.type === 'IN'
                        ? 'bg-success-50 dark:bg-success-950/30 text-success-600 dark:text-success-400'
                        : 'bg-danger-50 dark:bg-danger-950/30 text-danger-600 dark:text-danger-400'
                    }`}
                  >
                    {txn.type === 'IN' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-content">{txn.product?.productName}</p>
                    <p className="text-[11px] text-content-tertiary">{new Date(txn.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-extrabold block ${
                      txn.type === 'IN' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
                    }`}
                  >
                    {txn.type === 'IN' ? '+' : '-'}{txn.quantity} units
                  </span>
                  {txn.remarks && <span className="text-[10px] text-content-tertiary italic truncate max-w-[120px] block">{txn.remarks}</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Stock In & Stock Out Modals */}
      <StockInModal
        isOpen={isStockInOpen}
        onClose={() => setIsStockInOpen(false)}
        onSuccess={handleStockSuccess}
      />
      <StockOutModal
        isOpen={isStockOutOpen}
        onClose={() => setIsStockOutOpen(false)}
        onSuccess={handleStockSuccess}
      />
    </div>
  );
};
