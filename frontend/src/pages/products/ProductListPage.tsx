import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { usePermissions } from '../../hooks/usePermissions';
import { useDebounce } from '../../hooks/useDebounce';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../features/products/product.slice';
import { fetchCategories } from '../../features/categories/category.slice';
import { fetchSuppliers } from '../../features/suppliers/supplier.slice';
import { fetchDashboardData } from '../../features/dashboard/dashboard.slice';
import { productApi, ProductPayload } from '../../services/product.api';
import { Product, ProductStatus } from '../../types';
import { TableSkeleton } from '../../components/skeleton/TableSkeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ConfirmModal } from '../../components/feedback/ConfirmModal';
import { StatusBadge } from '../../components/common/StatusBadge';
import { RoleBadge } from '../../components/common/RoleBadge';
import { ProductDetailsModal } from '../../components/products/ProductDetailsModal';
import { QRCodeModal } from '../../components/products/QRCodeModal';
import { ImageUploader } from '../../components/products/ImageUploader';
import { StockInModal } from '../../components/transactions/StockInModal';
import { StockOutModal } from '../../components/transactions/StockOutModal';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { SearchInput } from '../../components/ui/SearchInput';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { DataTable } from '../../components/ui/DataTable';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Layers,
  Truck,
  Download,
  FileText,
  Eye,
  QrCode,
} from 'lucide-react';

export const ProductListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, meta, loading, actionLoading } = useAppSelector((state) => state.products);
  const categoriesState = useAppSelector((state) => state.categories);
  const suppliersState = useAppSelector((state) => state.suppliers);

  // Centralized Permissions
  const {
    canCreateProducts,
    canEditProducts,
    canDeleteProducts,
    canExport,
    isAdmin,
  } = usePermissions();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrProduct, setQrProduct] = useState<Product | null>(null);

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [removeImageFlag, setRemoveImageFlag] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductPayload>();

  // Fetch Categories & Suppliers for select dropdowns
  useEffect(() => {
    dispatch(fetchCategories({ page: 1, limit: 100 }));
    dispatch(fetchSuppliers({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Fetch Products when filters or page change
  useEffect(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
        categoryId: selectedCategory || undefined,
        supplierId: selectedSupplier || undefined,
        status: selectedStatus || undefined,
        sort: 'createdAt',
        order: 'desc',
      })
    );
  }, [dispatch, currentPage, debouncedSearch, selectedCategory, selectedSupplier, selectedStatus]);

  const handleExportCsv = async () => {
    if (!canExport) return;
    const toastId = toast.loading('Exporting Products CSV...');
    setExportingCsv(true);
    try {
      const blob = await productApi.exportProductsCsv({
        search: debouncedSearch,
        categoryId: selectedCategory || undefined,
        supplierId: selectedSupplier || undefined,
        status: selectedStatus || undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Products exported to CSV successfully', { id: toastId });
    } catch {
      toast.error('Failed to export Products CSV', { id: toastId });
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    if (!canExport) return;
    const toastId = toast.loading('Generating Products PDF...');
    setExportingPdf(true);
    try {
      const blob = await productApi.exportProductsPdf({
        search: debouncedSearch,
        categoryId: selectedCategory || undefined,
        supplierId: selectedSupplier || undefined,
        status: selectedStatus || undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Products exported to PDF successfully', { id: toastId });
    } catch {
      toast.error('Failed to export Products PDF', { id: toastId });
    } finally {
      setExportingPdf(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setSelectedImageFile(null);
    setRemoveImageFlag(false);
    reset({
      productName: '',
      sku: '',
      description: '',
      quantity: 1,
      lowStockThreshold: 5,
      unitPrice: 1,
      categoryId: categoriesState.items[0]?.id || '',
      supplierId: suppliersState.items[0]?.id || '',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setSelectedImageFile(null);
    setRemoveImageFlag(false);
    reset({
      productName: product.productName,
      sku: product.sku,
      description: product.description || '',
      quantity: product.quantity,
      lowStockThreshold: product.lowStockThreshold,
      unitPrice: product.unitPrice,
      categoryId: product.category.id,
      supplierId: product.supplier.id,
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: ProductPayload) => {
    const payload: ProductPayload = {
      ...data,
      quantity: Number(data.quantity),
      lowStockThreshold: Number(data.lowStockThreshold),
      unitPrice: Number(data.unitPrice),
      image: selectedImageFile,
      removeImage: removeImageFlag,
    };

    if (editingProduct) {
      const result = await dispatch(updateProduct({ id: editingProduct.id, payload }));
      if (updateProduct.fulfilled.match(result)) {
        if (selectedImageFile) {
          toast.success('Image uploaded successfully.');
        } else {
          toast.success('Product updated successfully!');
        }
        setIsFormModalOpen(false);
        setEditingProduct(null);
        setSelectedImageFile(null);
        setRemoveImageFlag(false);
        dispatch(fetchProducts({ page: currentPage, limit: 10, search: debouncedSearch, categoryId: selectedCategory || undefined, supplierId: selectedSupplier || undefined }));
        dispatch(fetchDashboardData());
      } else {
        toast.error('Unable to upload image or update product.');
      }
    } else {
      const result = await dispatch(createProduct(payload));
      if (createProduct.fulfilled.match(result)) {
        if (selectedImageFile) {
          toast.success('Image uploaded successfully.');
        } else {
          toast.success('Product created successfully!');
        }
        setIsFormModalOpen(false);
        setSelectedImageFile(null);
        setRemoveImageFlag(false);
        setCurrentPage(1);
        dispatch(fetchProducts({ page: 1, limit: 10, search: debouncedSearch, categoryId: selectedCategory || undefined, supplierId: selectedSupplier || undefined }));
        dispatch(fetchDashboardData());
      } else {
        toast.error('Unable to upload image or create product.');
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const result = await dispatch(deleteProduct(productToDelete.id));
    if (deleteProduct.fulfilled.match(result)) {
      toast.success('Product deleted successfully');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      dispatch(fetchProducts({ page: currentPage, limit: 10, search: debouncedSearch, categoryId: selectedCategory || undefined, supplierId: selectedSupplier || undefined }));
      dispatch(fetchDashboardData());
    } else if (deleteProduct.rejected.match(result)) {
      toast.error((result.payload as string) || 'Failed to delete product');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const categoryOptions = categoriesState.items.map((c) => ({ value: c.id, label: c.name }));
  const supplierOptions = suppliersState.items.map((s) => ({ value: s.id, label: s.name }));

  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (product: Product) => (
        <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.productName}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white">
              <Package className="h-5 w-5 opacity-90" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'product',
      header: 'Product & SKU',
      render: (product: Product) => (
        <div>
          <p className="font-bold text-content text-sm">{product.productName}</p>
          <span className="font-mono text-[11px] text-content-tertiary font-medium">{product.sku}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (product: Product) => (
        <span className="inline-flex items-center gap-1.5 font-medium text-content-secondary text-xs">
          <Layers className="h-3.5 w-3.5 text-purple-500" />
          {product.category?.name || 'Uncategorized'}
        </span>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (product: Product) => (
        <span className="inline-flex items-center gap-1.5 font-medium text-content-secondary text-xs">
          <Truck className="h-3.5 w-3.5 text-sky-500" />
          {product.supplier?.name || 'Unassigned'}
        </span>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (product: Product) => (
        <div className="font-bold text-sm text-content">
          {product.quantity}
          <span className="text-[10px] text-content-tertiary font-normal block">
            Threshold: {product.lowStockThreshold}
          </span>
        </div>
      ),
    },
    {
      key: 'unitPrice',
      header: 'Unit Price',
      render: (product: Product) => (
        <span className="font-bold text-content">${product.unitPrice?.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (product: Product) => <StatusBadge status={product.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      render: (product: Product) => (
        <div className="flex items-center justify-end gap-1.5">
          {!isAdmin && (
            <>
              <button
                onClick={() => setViewingProduct(product)}
                className="p-1.5 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg transition"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsStockInOpen(true)}
                className="px-2 py-1 text-[11px] font-bold text-success-600 bg-success-50 dark:bg-success-950/50 hover:bg-success-100 rounded-lg transition"
                title="Stock In"
              >
                + In
              </button>
              <button
                onClick={() => setIsStockOutOpen(true)}
                className="px-2 py-1 text-[11px] font-bold text-danger-600 bg-danger-50 dark:bg-danger-950/50 hover:bg-danger-100 rounded-lg transition"
                title="Stock Out"
              >
                - Out
              </button>
            </>
          )}

          {isAdmin && (
            <>
              {canEditProducts && (
                <button
                  onClick={() => handleOpenEditModal(product)}
                  className="p-1.5 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg transition"
                  title="Edit Product"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}

              {canDeleteProducts && (
                <button
                  onClick={() => {
                    setProductToDelete(product);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-1.5 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/40 rounded-lg transition"
                  title="Delete Product"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </>
          )}

          {/* QR Code Action Button */}
          <button
            onClick={() => {
              setQrProduct(product);
              setIsQrModalOpen(true);
            }}
            className="p-1.5 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition"
            title="View QR Code"
          >
            <QrCode className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-3.5 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 font-sans">
      {/* Page Header */}
      <PageHeader
        title="Products Management"
        description={
          canCreateProducts
            ? 'Manage product catalog, stock threshold levels, pricing, and vendor assignments.'
            : 'Browse warehouse inventory catalog, inspect specifications, and issue stock movements.'
        }
        icon={Package}
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

            {canCreateProducts && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleOpenAddModal}
              >
                Add Product
              </Button>
            )}
          </div>
        }
      />

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-[#141414] p-4 rounded-2xl border border-border dark:border-border shadow-subtle">
        <SearchInput
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          placeholder="Search SKU or Product Name..."
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

        <Select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value as ProductStatus | '');
            setCurrentPage(1);
          }}
          placeholder="All Stock Statuses"
          options={[
            { value: 'IN_STOCK', label: 'In Stock' },
            { value: 'LOW_STOCK', label: 'Low Stock' },
            { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
          ]}
        />
      </div>

      {/* Desktop DataTable View (Hidden on mobile) */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={items}
          keyExtractor={(p) => p.id}
          loading={loading}
          loadingComponent={<TableSkeleton rows={8} columns={8} />}
          emptyComponent={
            <EmptyState
              title="No Products Found"
              description="Try adjusting your search query or filters."
              actionText={canCreateProducts ? 'Add First Product' : undefined}
              onAction={canCreateProducts ? handleOpenAddModal : undefined}
            />
          }
          footer={
            meta && meta.totalPages > 1 ? (
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                itemLabel="products"
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
            title="No Products Found"
            description="Try adjusting your search query or filters."
            actionText={canCreateProducts ? 'Add First Product' : undefined}
            onAction={canCreateProducts ? handleOpenAddModal : undefined}
          />
        ) : (
          items.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-border dark:border-border shadow-subtle space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white">
                      <Package className="h-6 w-6 opacity-90" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-content text-sm truncate">{product.productName}</h3>
                    <StatusBadge status={product.status} />
                  </div>
                  <p className="font-mono text-xs text-content-tertiary font-semibold mt-0.5">{product.sku}</p>
                  <p className="text-xs font-extrabold text-primary-600 dark:text-primary-400 mt-1">
                    ${product.unitPrice?.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border-secondary dark:border-border-secondary">
                <div>
                  <span className="text-content-tertiary block text-[11px]">Category</span>
                  <span className="font-semibold text-content flex items-center gap-1 mt-0.5">
                    <Layers className="h-3 w-3 text-purple-500 flex-shrink-0" />
                    <span className="truncate">{product.category?.name || 'Unassigned'}</span>
                  </span>
                </div>
                <div>
                  <span className="text-content-tertiary block text-[11px]">Supplier</span>
                  <span className="font-semibold text-content flex items-center gap-1 mt-0.5">
                    <Truck className="h-3 w-3 text-sky-500 flex-shrink-0" />
                    <span className="truncate">{product.supplier?.name || 'Unassigned'}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border-secondary dark:border-border-secondary text-xs">
                <div>
                  <span className="text-content-tertiary text-[11px]">Stock: </span>
                  <span className="font-bold text-content">{product.quantity} units</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setQrProduct(product);
                      setIsQrModalOpen(true);
                    }}
                    className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                    title="QR Code"
                  >
                    <QrCode className="h-4 w-4" />
                  </button>
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg border border-primary-200 dark:border-primary-900"
                        title="Edit Product"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setProductToDelete(product);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/40 rounded-lg border border-danger-200 dark:border-danger-900"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setViewingProduct(product)}
                      className="px-3 py-1.5 text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-950/50 rounded-lg border border-primary-200 dark:border-primary-900"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            itemLabel="products"
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Product Details Modal for USER */}
      <ProductDetailsModal
        product={viewingProduct}
        isOpen={viewingProduct !== null}
        onClose={() => setViewingProduct(null)}
        onStockIn={() => setIsStockInOpen(true)}
        onStockOut={() => setIsStockOutOpen(true)}
      />

      {/* Stock Movement Modals */}
      <StockInModal
        isOpen={isStockInOpen}
        onClose={() => setIsStockInOpen(false)}
        onSuccess={() => dispatch(fetchProducts({ page: currentPage, limit: 10 }))}
      />
      <StockOutModal
        isOpen={isStockOutOpen}
        onClose={() => setIsStockOutOpen(false)}
        onSuccess={() => dispatch(fetchProducts({ page: currentPage, limit: 10 }))}
      />

      {/* Admin Add/Edit Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="md" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={actionLoading}
              onClick={handleSubmit(handleFormSubmit)}
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <ImageUploader
            currentImageUrl={editingProduct?.imageUrl}
            onImageSelected={(file) => {
              setSelectedImageFile(file);
              setRemoveImageFlag(false);
            }}
            onImageRemoved={() => {
              setSelectedImageFile(null);
              setRemoveImageFlag(true);
            }}
            isUploading={actionLoading}
          />

          <Input
            label="Product Name *"
            placeholder="e.g. Wireless Ergonomic Mouse"
            error={errors.productName?.message}
            {...register('productName', { required: 'Product Name is required' })}
          />

          <Input
            label="SKU (Unique Code) *"
            placeholder="e.g. WEM-1002"
            error={errors.sku?.message}
            {...register('sku', { required: 'SKU is required' })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Category *"
              error={errors.categoryId?.message}
              options={categoryOptions}
              {...register('categoryId', { required: 'Category is required' })}
            />

            <Select
              label="Supplier *"
              error={errors.supplierId?.message}
              options={supplierOptions}
              {...register('supplierId', { required: 'Supplier is required' })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Initial Qty"
              type="number"
              min="0"
              error={errors.quantity?.message}
              {...register('quantity', { required: 'Quantity required' })}
            />

            <Input
              label="Low Threshold"
              type="number"
              min="0"
              error={errors.lowStockThreshold?.message}
              {...register('lowStockThreshold', { required: 'Threshold required' })}
            />

            <Input
              label="Unit Price ($)"
              type="number"
              step="0.01"
              min="0.01"
              error={errors.unitPrice?.message}
              {...register('unitPrice', { required: 'Price required' })}
            />
          </div>

          <Textarea
            label="Description (Optional)"
            rows={2}
            {...register('description')}
          />
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.productName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={actionLoading}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => {
          setIsQrModalOpen(false);
          setQrProduct(null);
        }}
        product={qrProduct}
      />
    </div>
  );
};
