import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchDashboardData } from '../../features/dashboard/dashboard.slice';
import { productApi } from '../../services/product.api';
import { transactionApi } from '../../services/transaction.api';
import { RoleBadge } from '../../components/common/RoleBadge';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CardSkeleton, ChartSkeleton } from '../../components/skeleton/Skeletons';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Package,
  Boxes,
  Truck,
  DollarSign,
  AlertTriangle,
  XCircle,
  TrendingUp,
  FileText,
  ArrowDownRight,
  ArrowUpRight,
  Activity,
  BarChart2,
  PieChart as PieChartIcon,
  LayoutDashboard,
} from 'lucide-react';
import { ChartTooltip } from '../../components/common/ChartTooltip';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';

const CHART_COLORS = {
  inStock: '#22C55E',
  lowStock: '#F59E0B',
  outOfStock: '#EF4444',
  primary: '#0EA5E9',
};

export const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { summary, stockStatus, recentTransactions, topProducts, categoryValue, loading } =
    useAppSelector((state) => state.dashboard);

  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleExportPdf = async (type: 'products' | 'transactions') => {
    setExporting(type);
    const tid = toast.loading(`Generating ${type.toUpperCase()} PDF...`);
    try {
      const blob =
        type === 'products'
          ? await productApi.exportProductsPdf()
          : await transactionApi.exportTransactionsPdf();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-executive-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF report downloaded successfully!', { id: tid });
    } catch {
      toast.error('Failed to generate PDF report', { id: tid });
    } finally {
      setExporting(null);
    }
  };

  const pieData = stockStatus
    ? [
        { name: 'In Stock', value: stockStatus.inStock, color: CHART_COLORS.inStock },
        { name: 'Low Stock', value: stockStatus.lowStock, color: CHART_COLORS.lowStock },
        { name: 'Out of Stock', value: stockStatus.outOfStock, color: CHART_COLORS.outOfStock },
      ]
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <PageHeader
        title="Executive Dashboard"
        description="Real-time business performance, inventory valuation, and strategic metrics overview."
        icon={LayoutDashboard}
        badge={<RoleBadge role="ADMIN" size="md" />}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={FileText}
            loading={exporting === 'products'}
            onClick={() => handleExportPdf('products')}
          >
            Export Executive PDF
          </Button>
        }
      />

      {/* KPI Cards Grid */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard
            label="Products"
            value={summary?.totalProducts || 0}
            icon={Package}
            iconColor="text-primary-500"
            iconBg="bg-primary-50 dark:bg-primary-950/30"
            subtitle="Total SKUs"
          />

          <StatsCard
            label="Valuation"
            value={`$${summary?.totalInventoryValue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`}
            icon={DollarSign}
            iconColor="text-success-500"
            iconBg="bg-success-50 dark:bg-success-950/30"
            subtitle="Total Inventory Value"
          />

          <StatsCard
            label="Categories"
            value={summary?.totalCategories || 0}
            icon={Boxes}
            iconColor="text-purple-500"
            iconBg="bg-purple-50 dark:bg-purple-950/30"
            subtitle="Classifications"
          />

          <StatsCard
            label="Suppliers"
            value={summary?.totalSuppliers || 0}
            icon={Truck}
            iconColor="text-sky-500"
            iconBg="bg-sky-50 dark:bg-sky-950/30"
            subtitle="Active Vendors"
          />

          <StatsCard
            label="Low Stock"
            value={summary?.lowStockProducts || 0}
            icon={AlertTriangle}
            iconColor="text-warning-500"
            iconBg="bg-warning-50 dark:bg-warning-950/30"
            subtitle="Needs Restock"
            variant="warning"
          />

          <StatsCard
            label="Out of Stock"
            value={summary?.outOfStockProducts || 0}
            icon={XCircle}
            iconColor="text-danger-500"
            iconBg="bg-danger-50 dark:bg-danger-950/30"
            subtitle="Zero Units"
            variant="danger"
          />
        </div>
      )}

      {/* Charts Section */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Value Bar Chart */}
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-6">
              <BarChart2 className="h-5 w-5 text-primary-500" />
              <h3 className="font-bold text-content text-base">Category Valuation ($)</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryValue || []}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                  <Tooltip content={<ChartTooltip isCurrency={true} />} />
                  <Bar dataKey="inventoryValue" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Stock Status Distribution */}
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-6">
              <PieChartIcon className="h-5 w-5 text-success-500" />
              <h3 className="font-bold text-content text-base">Stock Distribution Breakdown</h3>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                    {pieData.map((e, idx) => (
                      <Cell key={idx} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Top Products & Audit Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Value */}
        <Card padding="lg">
          <h3 className="font-bold text-content text-base mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary-500" />
            Top Products by Inventory Value
          </h3>
          <div className="space-y-3">
            {topProducts?.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-surface-secondary dark:bg-[#1A1A1A] border border-border-secondary dark:border-border">
                <div>
                  <p className="text-xs font-bold text-content">{item.product?.productName}</p>
                  <p className="text-[11px] text-content-tertiary font-mono">SKU: {item.product?.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-extrabold text-primary-600 dark:text-primary-400">
                    ${item.inventoryValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-content-tertiary">{item.quantity} units in stock</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Movement Feed */}
        <Card padding="lg">
          <h3 className="font-bold text-content text-base mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-success-500" />
            Executive Audit Trail (Recent Movements)
          </h3>
          <div className="space-y-3">
            {recentTransactions?.slice(0, 5).map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3.5 rounded-xl bg-surface-secondary dark:bg-[#1A1A1A] border border-border-secondary dark:border-border">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${txn.type === 'IN' ? 'bg-success-50 dark:bg-success-950/30 text-success-600' : 'bg-danger-50 dark:bg-danger-950/30 text-danger-600'}`}>
                    {txn.type === 'IN' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-content">{txn.product?.productName}</p>
                    <p className="text-[11px] text-content-tertiary">{new Date(txn.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold ${txn.type === 'IN' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                  {txn.type === 'IN' ? '+' : '-'}{txn.quantity} units
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
