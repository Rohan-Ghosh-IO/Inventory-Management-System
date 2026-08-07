import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { usePermissions } from '../../hooks/usePermissions';
import { useDebounce } from '../../hooks/useDebounce';
import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../../features/suppliers/supplier.slice';
import { fetchDashboardData } from '../../features/dashboard/dashboard.slice';
import { supplierApi } from '../../services/supplier.api';
import { Supplier } from '../../types';
import { SupplierPayload } from '../../services/supplier.api';
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
  Truck,
  Mail,
  Phone,
  MapPin,
  Download,
  FileText,
  Package,
} from 'lucide-react';

export const SupplierListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, meta, loading, actionLoading } = useAppSelector((state) => state.suppliers);

  const { canManageSuppliers, canExport } = usePermissions();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierPayload>();

  useEffect(() => {
    dispatch(
      fetchSuppliers({
        page: currentPage,
        limit: 10,
        search: debouncedSearch,
      })
    );
  }, [dispatch, currentPage, debouncedSearch]);

  const handleExportCsv = async () => {
    if (!canExport) return;
    const toastId = toast.loading('Exporting Suppliers CSV...');
    setExportingCsv(true);
    try {
      const blob = await supplierApi.exportSuppliersCsv(debouncedSearch || undefined);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `suppliers-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Suppliers exported to CSV successfully', { id: toastId });
    } catch {
      toast.error('Failed to export Suppliers CSV', { id: toastId });
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    if (!canExport) return;
    const toastId = toast.loading('Generating Suppliers PDF...');
    setExportingPdf(true);
    try {
      const blob = await supplierApi.exportSuppliersPdf(debouncedSearch || undefined);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `suppliers-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Suppliers exported to PDF successfully', { id: toastId });
    } catch {
      toast.error('Failed to export Suppliers PDF', { id: toastId });
    } finally {
      setExportingPdf(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingSupplier(null);
    reset({ name: '', email: '', phone: '', address: '' });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    reset({
      name: supplier.name,
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
    });
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: SupplierPayload) => {
    if (editingSupplier) {
      const result = await dispatch(updateSupplier({ id: editingSupplier.id, payload: data }));
      if (updateSupplier.fulfilled.match(result)) {
        toast.success('Supplier updated successfully!');
        setIsFormModalOpen(false);
        setEditingSupplier(null);
        dispatch(fetchSuppliers({ page: currentPage, limit: 10, search: debouncedSearch }));
        dispatch(fetchDashboardData());
      }
    } else {
      const result = await dispatch(createSupplier(data));
      if (createSupplier.fulfilled.match(result)) {
        toast.success('Supplier created successfully!');
        setIsFormModalOpen(false);
        setCurrentPage(1);
        dispatch(fetchSuppliers({ page: 1, limit: 10, search: debouncedSearch }));
        dispatch(fetchDashboardData());
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!supplierToDelete) return;
    const result = await dispatch(deleteSupplier(supplierToDelete.id));
    if (deleteSupplier.fulfilled.match(result)) {
      toast.success('Supplier deleted successfully');
      setIsDeleteModalOpen(false);
      setSupplierToDelete(null);
      dispatch(fetchSuppliers({ page: currentPage, limit: 10, search: debouncedSearch }));
    } else if (deleteSupplier.rejected.match(result)) {
      toast.error((result.payload as string) || 'Failed to delete supplier');
      setIsDeleteModalOpen(false);
      setSupplierToDelete(null);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Supplier Name',
      render: (sup: Supplier) => (
        <span className="font-bold text-content text-sm">{sup.name}</span>
      ),
    },
    {
      key: 'email',
      header: 'Contact Email',
      render: (sup: Supplier) =>
        sup.email ? (
          <span className="inline-flex items-center gap-1.5 text-content-secondary text-xs">
            <Mail className="h-3.5 w-3.5 text-content-tertiary" />
            {sup.email}
          </span>
        ) : (
          <span className="text-content-tertiary italic text-xs">No email</span>
        ),
    },
    {
      key: 'phone',
      header: 'Phone Number',
      render: (sup: Supplier) =>
        sup.phone ? (
          <span className="inline-flex items-center gap-1.5 text-content-secondary font-mono text-[11px]">
            <Phone className="h-3.5 w-3.5 text-content-tertiary" />
            {sup.phone}
          </span>
        ) : (
          <span className="text-content-tertiary italic text-xs">No phone</span>
        ),
    },
    {
      key: 'address',
      header: 'Address',
      render: (sup: Supplier) =>
        sup.address ? (
          <span className="inline-flex items-center gap-1.5 text-content-secondary text-xs max-w-xs truncate">
            <MapPin className="h-3.5 w-3.5 text-content-tertiary" />
            {sup.address}
          </span>
        ) : (
          <span className="text-content-tertiary italic text-xs">No address</span>
        ),
    },
    {
      key: 'products',
      header: 'Products Supplied',
      render: (sup: Supplier) => (
        <Badge variant="primary" size="sm">
          <Package className="h-3 w-3" />
          {sup._count?.products ?? 0} Products
        </Badge>
      ),
    },
    ...(canManageSuppliers
      ? [
          {
            key: 'actions',
            header: 'Actions',
            headerClassName: 'text-right',
            render: (sup: Supplier) => (
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(sup)}
                  className="p-1.5 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg transition"
                  title="Edit Supplier"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setSupplierToDelete(sup);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-1.5 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/40 rounded-lg transition"
                  title="Delete Supplier"
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
        title="Suppliers Management"
        description={
          canManageSuppliers
            ? 'Manage supply chain vendor profiles, contacts, and product distributions.'
            : 'Browse active vendor partners, contacts, and catalog distributions.'
        }
        icon={Truck}
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
            {canManageSuppliers && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={handleOpenAddModal}
              >
                Add Supplier
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
          placeholder="Search Suppliers by Name..."
        />
      </div>

      {/* Desktop DataTable View (Hidden on mobile) */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={items}
          keyExtractor={(s) => s.id}
          loading={loading}
          loadingComponent={<TableSkeleton rows={6} columns={6} />}
          emptyComponent={
            <EmptyState
              title="No Suppliers Found"
              description="No vendor profiles match your search criteria."
              actionText={canManageSuppliers ? 'Add First Supplier' : undefined}
              onAction={canManageSuppliers ? handleOpenAddModal : undefined}
            />
          }
          footer={
            meta && meta.totalPages > 1 ? (
              <Pagination
                currentPage={meta.page}
                totalPages={meta.totalPages}
                totalItems={meta.total}
                itemLabel="suppliers"
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
            title="No Suppliers Found"
            description="No vendor profiles match your search criteria."
            actionText={canManageSuppliers ? 'Add First Supplier' : undefined}
            onAction={canManageSuppliers ? handleOpenAddModal : undefined}
          />
        ) : (
          items.map((sup) => (
            <div
              key={sup.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#141414] border border-border dark:border-border shadow-subtle space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-content text-base">{sup.name}</h3>
                <Badge variant="primary" size="sm" className="flex-shrink-0">
                  <Package className="h-3 w-3" />
                  {sup._count?.products ?? 0} Products
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs text-content-secondary">
                {sup.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-content-tertiary flex-shrink-0" />
                    <span className="truncate">{sup.email}</span>
                  </div>
                )}
                {sup.phone && (
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Phone className="h-3.5 w-3.5 text-content-tertiary flex-shrink-0" />
                    <span>{sup.phone}</span>
                  </div>
                )}
                {sup.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-content-tertiary flex-shrink-0" />
                    <span className="truncate">{sup.address}</span>
                  </div>
                )}
              </div>

              {canManageSuppliers && (
                <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-border-secondary dark:border-border-secondary">
                  <button
                    onClick={() => handleOpenEditModal(sup)}
                    className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg border border-primary-200 dark:border-primary-900"
                    title="Edit Supplier"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSupplierToDelete(sup);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-950/40 rounded-lg border border-danger-200 dark:border-danger-900"
                    title="Delete Supplier"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            totalItems={meta.total}
            itemLabel="suppliers"
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Admin Add/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
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
              {editingSupplier ? 'Save Changes' : 'Create Supplier'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Supplier Name *"
            placeholder="e.g. Acme Logistics & Tech"
            error={errors.name?.message}
            {...register('name', { required: 'Supplier Name is required' })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="contact@acme.com"
              {...register('email')}
            />

            <Input
              label="Phone Number"
              type="text"
              placeholder="+1-555-0192"
              {...register('phone')}
            />
          </div>

          <Textarea
            label="Address / Warehouse Location"
            rows={2}
            placeholder="100 Enterprise Way, Suite 400"
            {...register('address')}
          />
        </form>
      </Modal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${supplierToDelete?.name}"?`}
        confirmLabel="Delete"
        isLoading={actionLoading}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
