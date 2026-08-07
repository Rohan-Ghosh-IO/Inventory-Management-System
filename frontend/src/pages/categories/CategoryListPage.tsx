import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { usePermissions } from '../../hooks/usePermissions';
import { useDebounce } from '../../hooks/useDebounce';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../features/categories/category.slice';
import { fetchDashboardData } from '../../features/dashboard/dashboard.slice';
import { categoryApi } from '../../services/category.api';
import { Category } from '../../types';
import { CategoryPayload } from '../../services/category.api';
import { TableSkeleton } from '../../components/skeleton/TableSkeleton';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ConfirmModal } from '../../components/feedback/ConfirmModal';
import { RoleBadge } from '../../components/common/RoleBadge';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { SearchInput } from '../../components/ui/SearchInput';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import {
  Plus,
  Edit2,
  Trash2,
  Tags,
  Download,
  FileText,
  Package,
} from 'lucide-react';

export const CategoryListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, meta, loading, actionLoading } = useAppSelector((state) => state.categories);

  const { canManageCategories, canExport } = usePermissions();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryPayload>();

  useEffect(() => {
    dispatch(
      fetchCategories({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, debouncedSearch]);

  const handleExportCsv = async () => {
    if (!canExport) return;
    const toastId = toast.loading('Exporting Categories CSV...');
    setExportingCsv(true);
    try {
      const blob = await categoryApi.exportCategoriesCsv(debouncedSearch || undefined);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `categories-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Categories exported to CSV successfully', { id: toastId });
    } catch {
      toast.error('Failed to export Categories CSV', { id: toastId });
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    if (!canExport) return;
    const toastId = toast.loading('Generating Categories PDF...');
    setExportingPdf(true);
    try {
      const blob = await categoryApi.exportCategoriesPdf(debouncedSearch || undefined);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `categories-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Categories exported to PDF successfully', { id: toastId });
    } catch {
      toast.error('Failed to export Categories PDF', { id: toastId });
    } finally {
      setExportingPdf(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    reset({ name: '', description: '' });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    reset({ name: category.name, description: category.description || '' });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: CategoryPayload) => {
    if (editingCategory) {
      const result = await dispatch(updateCategory({ id: editingCategory.id, payload: data }));
      if (updateCategory.fulfilled.match(result)) {
        toast.success('Category updated successfully!');
        setIsFormModalOpen(false);
        setEditingCategory(null);
        dispatch(fetchCategories({ page: currentPage, limit: 10, search: debouncedSearch }));
        dispatch(fetchDashboardData());
      }
    } else {
      const result = await dispatch(createCategory(data));
      if (createCategory.fulfilled.match(result)) {
        toast.success('Category created successfully!');
        setIsFormModalOpen(false);
        setCurrentPage(1);
        dispatch(fetchCategories({ page: 1, limit: 10, search: debouncedSearch }));
        dispatch(fetchDashboardData());
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    const result = await dispatch(deleteCategory(categoryToDelete.id));
    if (deleteCategory.fulfilled.match(result)) {
      toast.success('Category deleted successfully');
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      dispatch(fetchCategories({ page: currentPage, limit: 10, search: debouncedSearch }));
    } else if (deleteCategory.rejected.match(result)) {
      toast.error((result.payload as string) || 'Failed to delete category');
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Category Name',
      render: (cat: Category) => (
        <span className="font-bold text-content text-sm">{cat.name}</span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (cat: Category) => (
        <span className="text-content-secondary text-xs max-w-xs truncate block">
          {cat.description || 'No description provided.'}
        </span>
      ),
    },
    {
      key: 'products',
      header: 'Associated Products',
      render: (cat: Category) => (
        <Badge variant="primary" size="sm">
          <Package className="h-3 w-3" />
          {cat._count?.products ?? 0} Products
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created Date',
      render: (cat: Category) => (
        <span className="text-content-tertiary font-mono text-[11px]">
          {new Date(cat.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    ...(canManageCategories
      ? [
          {
            key: 'actions',
            header: 'Actions',
            headerClassName: 'text-right',
            render: (cat: Category) => (
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(cat)}
                  className="p-1.5 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg transition"
                  title="Edit Category"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setCategoryToDelete(cat);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-1.5 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/40 rounded-lg transition"
                  title="Delete Category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="p-3.5 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 font-sans">
      {/* Page Header */}
      <PageHeader
        title="Categories Management"
        description={
          canManageCategories
            ? 'Organize inventory products into logical classifications and management categories.'
            : 'Browse warehouse product category classifications and item counts.'
        }
        icon={Tags}
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
            {canManageCategories && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleOpenAddModal}
              >
                Add Category
              </Button>
            )}
          </div>
        }
      />

      {/* Search Toolbar */}
      <div className="bg-white dark:bg-[#141414] p-4 rounded-2xl border border-border dark:border-border shadow-subtle max-w-md">
        <SearchInput
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          placeholder="Search Categories by Name..."
        />
      </div>

      {/* Desktop DataTable View (Hidden on mobile) */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={items}
          keyExtractor={(c) => c.id}
          loading={loading}
          loadingComponent={<TableSkeleton rows={6} columns={5} />}
          emptyComponent={
            <EmptyState
              title="No Categories Found"
              description="No category classifications match your search query."
              actionText={canManageCategories ? 'Add First Category' : undefined}
              onAction={canManageCategories ? handleOpenAddModal : undefined}
            />
          }
          footer={
            meta && meta.totalPages > 1 ? (
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                itemLabel="categories"
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
            title="No Categories Found"
            description="No category classifications match your search query."
            actionText={canManageCategories ? 'Add First Category' : undefined}
            onAction={canManageCategories ? handleOpenAddModal : undefined}
          />
        ) : (
          items.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-border dark:border-border shadow-subtle space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-content text-base">{cat.name}</h3>
                  <p className="text-xs text-content-secondary mt-1">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>
                <Badge variant="primary" size="sm" className="flex-shrink-0">
                  <Package className="h-3 w-3" />
                  {cat._count?.products ?? 0} Products
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border-secondary dark:border-border-secondary text-xs">
                <span className="text-content-tertiary font-mono text-[11px]">
                  Created: {new Date(cat.createdAt).toLocaleDateString()}
                </span>

                {canManageCategories && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg border border-primary-200 dark:border-primary-900"
                      title="Edit Category"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCategoryToDelete(cat);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/40 rounded-lg border border-danger-200 dark:border-danger-900"
                      title="Delete Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            itemLabel="categories"
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Admin Add/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
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
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Category Name *"
            placeholder="e.g. Computer Accessories"
            error={errors.name?.message}
            {...register('name', { required: 'Category Name is required' })}
          />

          <Textarea
            label="Description (Optional)"
            rows={3}
            placeholder="e.g. Peripherals, cables, and adapters"
            {...register('description')}
          />
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"?`}
        confirmLabel="Delete"
        isLoading={actionLoading}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
