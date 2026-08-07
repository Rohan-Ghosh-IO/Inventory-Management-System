import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { usePermissions } from '../../hooks/usePermissions';
import { fetchTransactions } from '../../features/transactions/transaction.slice';
import { fetchProducts } from '../../features/products/product.slice';
import { fetchCategories } from '../../features/categories/category.slice';
import { fetchSuppliers } from '../../features/suppliers/supplier.slice';
import { transactionApi } from '../../services/transaction.api';
import { TransactionType, InventoryTransaction } from '../../types';
import { StockInModal } from '../../components/transactions/StockInModal';
import { StockOutModal } from '../../components/transactions/StockOutModal';
import { TableSkeleton } from '../../components/skeleton/TableSkeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { RoleBadge } from '../../components/common/RoleBadge';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import {
  History,
  ArrowDownRight,
  ArrowUpRight,
  Download,
  FileText,
  Layers,
  PlusCircle,
  MinusCircle,
} from 'lucide-react';

export const TransactionHistoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, meta, loading } = useAppSelector((state) => state.transactions);
  const productsState = useAppSelector((state) => state.products);
  const categoriesState = useAppSelector((state) => state.categories);
  const suppliersState = useAppSelector((state) => state.suppliers);

  const { canExport } = usePermissions();

  const [selectedType, setSelectedType] = useState<TransactionType | ''>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 100 }));
    dispatch(fetchCategories({ page: 1, limit: 100 }));
    dispatch(fetchSuppliers({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: currentPage,
        limit: 10,
        type: selectedType || undefined,
        productId: selectedProduct || undefined,
        categoryId: selectedCategory || undefined,
        supplierId: selectedSupplier || undefined,
        sort: 'createdAt',
        order: 'desc',
      })
    );
  }, [dispatch, currentPage, selectedType, selectedProduct, selectedCategory, selectedSupplier]);

  const handleExportCsv = async () => {
    if (!canExport) return;
    const toastId = toast.loading('Exporting Audit Log CSV...');
    setExportingCsv(true);
    try {
      const blob = await transactionApi.exportTransactionsCsv({
        type: selectedType || undefined,
        productId: selectedProduct || undefined,
        categoryId: selectedCategory || undefined,
        supplierId: selectedSupplier || undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-audit-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Transactions audit exported to CSV successfully', { id: toastId });
    } catch {
      toast.error('Failed to export Transactions CSV', { id: toastId });
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    if (!canExport) return;
    const toastId = toast.loading('Generating Audit Log PDF...');
    setExportingPdf(true);
    try {
      const blob = await transactionApi.exportTransactionsPdf({
        type: selectedType || undefined,
        productId: selectedProduct || undefined,
        categoryId: selectedCategory || undefined,
        supplierId: selectedSupplier || undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Transactions audit exported to PDF successfully', { id: toastId });
    } catch {
      toast.error('Failed to export Transactions PDF', { id: toastId });
    } finally {
      setExportingPdf(false);
    }
  };

  const handleStockSuccess = () => {
    dispatch(
      fetchTransactions({
        page: 1,
        limit: 10,
        type: selectedType || undefined,
        productId: selectedProduct || undefined,
        categoryId: selectedCategory || undefined,
        supplierId: selectedSupplier || undefined,
        sort: 'createdAt',
        order: 'desc',
      })
    );
    setCurrentPage(1);
  };

  const productOptions = productsState.items.map((p) => ({
    value: p.id,
    label: `${p.productName} (${p.sku})`,
  }));

  const categoryOptions = categoriesState.items.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const supplierOptions = suppliersState.items.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const columns = [
    {
      key: 'type',
      header: 'Movement Type',
      render: (t: InventoryTransaction) => (
        <Badge variant={t.type === 'IN' ? 'success' : 'danger'} size="sm">
          {t.type === 'IN' ? (
            <ArrowDownRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5" />
          )}
          Stock {t.type}
        </Badge>
      ),
    },
    {
      key: 'product',
      header: 'Product & SKU',
      render: (t: InventoryTransaction) => (
        <div>
          <p className="font-bold text-content text-sm">{t.product?.productName}</p>
          <span className="font-mono text-[11px] text-content-tertiary font-medium">
            {t.product?.sku}
          </span>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (t: InventoryTransaction) => (
        <span
          className={`font-extrabold text-sm ${
            t.type === 'IN' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
          }`}
        >
          {t.type === 'IN' ? '+' : '-'}{t.quantity} units
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (t: InventoryTransaction) => (
        <span className="inline-flex items-center gap-1.5 text-content-secondary text-xs font-medium">
          <Layers className="h-3.5 w-3.5 text-purple-500" />
          {t.product?.category?.name || 'Uncategorized'}
        </span>
      ),
    },
    {
      key: 'remarks',
      header: 'Remarks / Notes',
      render: (t: InventoryTransaction) => (
        <span className="text-content-secondary text-xs italic max-w-xs truncate block">
          {t.remarks || 'No remarks added.'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Timestamp',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (t: InventoryTransaction) => (
        <span className="text-content-tertiary font-mono text-[11px]">
          {new Date(t.createdAt).toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div className="p-3.5 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 font-sans">
      {/* Page Header */}
      <PageHeader
        title="Stock Movement Audit Log"
        description="Complete real-time audit trail of all inventory inward (add) and outward (issue) stock movements."
        icon={History}
        badge={<RoleBadge />}
        actions={
          <div className="flex items-center gap-2">
            {canExport && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Download}
                  loading={exportingCsv}
                  onClick={handleExportCsv}
                >
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={FileText}
                  loading={exportingPdf}
                  onClick={handleExportPdf}
                >
                  PDF
                </Button>
              </>
            )}
            <Button
              variant="success"
              size="sm"
              icon={PlusCircle}
              onClick={() => setIsStockInOpen(true)}
            >
              Stock In (+ Add)
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={MinusCircle}
              onClick={() => setIsStockOutOpen(true)}
            >
              Stock Out (- Issue)
            </Button>
          </div>
        }
      />

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-[#141414] p-4 rounded-2xl border border-border dark:border-border shadow-subtle">
        <Select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value as TransactionType | '');
            setCurrentPage(1);
          }}
          placeholder="All Movement Types"
          options={[
            { value: 'IN', label: 'Stock Inward (+)' },
            { value: 'OUT', label: 'Stock Outward (-)' },
          ]}
        />

        <Select
          value={selectedProduct}
          onChange={(e) => {
            setSelectedProduct(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="All Products"
          options={productOptions}
        />

        <Select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="All Categories"
          options={categoryOptions}
        />

        <Select
          value={selectedSupplier}
          onChange={(e) => {
            setSelectedSupplier(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="All Suppliers"
          options={supplierOptions}
        />
      </div>

      {/* Desktop DataTable View (Hidden on mobile) */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={items}
          keyExtractor={(t) => t.id}
          loading={loading}
          loadingComponent={<TableSkeleton rows={8} columns={6} />}
          emptyComponent={
            <EmptyState
              title="No Transactions Logged"
              description="No inventory movement records match your filter criteria."
            />
          }
          footer={
            meta && meta.totalPages > 1 ? (
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                itemLabel="audit records"
                onPageChange={(page) => setCurrentPage(page)}
              />
            ) : undefined
          }
        />
      </div>

      {/* Mobile Responsive Cards (Visible on <md) */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <TableSkeleton rows={4} columns={1} />
        ) : items.length === 0 ? (
          <EmptyState
            title="No Transactions Logged"
            description="No inventory movement records match your filter criteria."
          />
        ) : (
          items.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-border dark:border-border shadow-subtle space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-content text-sm">{t.product?.productName}</h3>
                  <span className="font-mono text-xs text-content-tertiary">{t.product?.sku}</span>
                </div>
                <Badge variant={t.type === 'IN' ? 'success' : 'danger'} size="sm" className="flex-shrink-0">
                  {t.type === 'IN' ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                  Stock {t.type}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-border-secondary dark:border-border-secondary">
                <span className="text-content-tertiary">Quantity Moved:</span>
                <span
                  className={`font-extrabold text-sm ${
                    t.type === 'IN' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
                  }`}
                >
                  {t.type === 'IN' ? '+' : '-'}{t.quantity} units
                </span>
              </div>

              {t.remarks && (
                <p className="text-xs text-content-secondary italic bg-surface-secondary dark:bg-[#1A1A1A] p-2 rounded-lg border border-border/40">
                  "{t.remarks}"
                </p>
              )}

              <div className="flex items-center justify-between text-xs pt-2 border-t border-border-secondary dark:border-border-secondary text-content-tertiary">
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-purple-500" />
                  {t.product?.category?.name || 'Uncategorized'}
                </span>
                <span className="font-mono text-[11px]">{new Date(t.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}

        {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            itemLabel="audit records"
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
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
