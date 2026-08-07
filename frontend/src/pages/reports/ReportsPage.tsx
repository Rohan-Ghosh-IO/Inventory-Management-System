import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { fetchDashboardData } from '../../features/dashboard/dashboard.slice';
import { productApi } from '../../services/product.api';
import { categoryApi } from '../../services/category.api';
import { supplierApi } from '../../services/supplier.api';
import { transactionApi } from '../../services/transaction.api';
import { RoleBadge } from '../../components/common/RoleBadge';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import {
  FileBarChart,
  Download,
  FileText,
  Package,
  Boxes,
  Truck,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart2,
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

export const ReportsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { summary, categoryValue, stockStatus } = useAppSelector(
    (state) => state.dashboard
  );

  const [exportingModule, setExportingModule] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleExportCsv = async (module: 'products' | 'categories' | 'suppliers' | 'transactions') => {
    setExportingModule(`${module}-csv`);
    const tid = toast.loading(`Generating ${module.toUpperCase()} CSV report...`);
    try {
      let blob: Blob;
      if (module === 'products') blob = await productApi.exportProductsCsv();
      else if (module === 'categories') blob = await categoryApi.exportCategoriesCsv();
      else if (module === 'suppliers') blob = await supplierApi.exportSuppliersCsv();
      else blob = await transactionApi.exportTransactionsCsv();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${module}-report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${module.toUpperCase()} CSV downloaded!`, { id: tid });
    } catch {
      toast.error(`Failed to export ${module} CSV`, { id: tid });
    } finally {
      setExportingModule(null);
    }
  };

  const handleExportPdf = async (type: 'products' | 'transactions') => {
    setExportingModule(`${type}-pdf`);
    const tid = toast.loading(`Generating ${type.toUpperCase()} PDF...`);
    try {
      const blob =
        type === 'products'
          ? await productApi.exportProductsPdf()
          : await transactionApi.exportTransactionsPdf();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${type.toUpperCase()} PDF downloaded!`, { id: tid });
    } catch {
      toast.error(`Failed to export ${type} PDF`, { id: tid });
    } finally {
      setExportingModule(null);
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
      {/* Page Header */}
      <PageHeader
        title="Analytics & Executive Reports"
        description="Comprehensive inventory insights, distribution metrics, and instant PDF/CSV data exports."
        icon={FileBarChart}
        badge={<RoleBadge role="ADMIN" size="md" />}
      />

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Inventory Value"
          value={`$${summary?.totalInventoryValue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`}
          icon={DollarSign}
          iconColor="text-success-500"
          iconBg="bg-success-50 dark:bg-success-950/30"
          subtitle="Real-time asset valuation"
        />

        <StatsCard
          label="Cataloged Products"
          value={summary?.totalProducts || 0}
          icon={Package}
          iconColor="text-primary-500"
          iconBg="bg-primary-50 dark:bg-primary-950/30"
          subtitle="Active SKUs in system"
        />

        <StatsCard
          label="Product Categories"
          value={summary?.totalCategories || 0}
          icon={Boxes}
          iconColor="text-purple-500"
          iconBg="bg-purple-50 dark:bg-purple-950/30"
          subtitle="Item classifications"
        />

        <StatsCard
          label="Active Suppliers"
          value={summary?.totalSuppliers || 0}
          icon={Truck}
          iconColor="text-sky-500"
          iconBg="bg-sky-50 dark:bg-sky-950/30"
          subtitle="Registered vendor partners"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Value Bar Chart */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="h-5 w-5 text-primary-500" />
            <h3 className="font-bold text-content text-base">Category Value Breakdown ($)</h3>
          </div>
          <div className="h-72">
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
            <h3 className="font-bold text-content text-base">Stock Status Distribution</h3>
          </div>
          <div className="h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Export Report Hub */}
      <Card padding="lg">
        <h3 className="text-lg font-bold text-content mb-2 flex items-center gap-2">
          <Download className="h-5 w-5 text-primary-500" />
          Export Executive Reports
        </h3>
        <p className="text-sm text-content-secondary mb-6">
          Download formatted CSV spreadsheets or professional A4 PDF reports for auditing and compliance.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'products', name: 'Products Catalog' },
            { id: 'categories', name: 'Categories Summary' },
            { id: 'suppliers', name: 'Suppliers Directory' },
            { id: 'transactions', name: 'Stock Movements' },
          ].map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-xl border border-border dark:border-border bg-surface-secondary dark:bg-[#1A1A1A] space-y-3"
            >
              <p className="font-bold text-sm text-content">{m.name}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Download}
                  loading={exportingModule === `${m.id}-csv`}
                  disabled={exportingModule !== null}
                  onClick={() => handleExportCsv(m.id as any)}
                  fullWidth
                >
                  CSV
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={FileText}
                  loading={exportingModule === `${m.id}-pdf`}
                  disabled={exportingModule !== null}
                  onClick={() => handleExportPdf(m.id as any)}
                  fullWidth
                >
                  PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
