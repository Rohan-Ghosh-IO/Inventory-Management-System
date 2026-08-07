import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { performStockIn } from '../../features/transactions/transaction.slice';
import { fetchProducts } from '../../features/products/product.slice';
import { fetchDashboardData } from '../../features/dashboard/dashboard.slice';
import { StockMovementPayload } from '../../services/transaction.api';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { ArrowDownRight } from 'lucide-react';

interface StockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StockInModal: React.FC<StockInModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const productsState = useAppSelector((state) => state.products);
  const { actionLoading } = useAppSelector((state) => state.transactions);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockMovementPayload>({
    defaultValues: {
      productId: '',
      quantity: 1,
      remarks: '',
    },
  });

  const onSubmit = async (data: StockMovementPayload) => {
    const payload = {
      ...data,
      quantity: Number(data.quantity),
    };

    const result = await dispatch(performStockIn(payload));
    if (performStockIn.fulfilled.match(result)) {
      toast.success('Stock added successfully!');
      reset();
      onClose();
      dispatch(fetchProducts({ page: 1, limit: 100 }));
      dispatch(fetchDashboardData());
      if (onSuccess) onSuccess();
    }
  };

  const productOptions = productsState.items.map((p) => ({
    value: p.id,
    label: `${p.productName} (${p.sku}) — Current: ${p.quantity} units`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stock Inward (Add Stock)"
      description="Record incoming stock shipment or purchase order into warehouse inventory."
      size="lg"
      icon={
        <div className="h-10 w-10 rounded-xl bg-success-50 dark:bg-success-950/30 text-success-500 flex items-center justify-center font-bold">
          <ArrowDownRight className="h-5 w-5" />
        </div>
      }
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            variant="success"
            size="md"
            loading={actionLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Confirm Stock In
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Select Product *"
          placeholder="Select a product..."
          options={productOptions}
          error={errors.productId?.message}
          {...register('productId', { required: 'Please select a product' })}
        />

        <Input
          label="Quantity to Inward *"
          type="number"
          min="1"
          placeholder="10"
          error={errors.quantity?.message}
          {...register('quantity', {
            required: 'Quantity is required',
            min: { value: 1, message: 'Quantity must be at least 1' },
          })}
        />

        <Textarea
          label="Remarks / Note (Optional)"
          rows={3}
          placeholder="e.g. Received shipment batch #104"
          {...register('remarks')}
        />
      </form>
    </Modal>
  );
};
