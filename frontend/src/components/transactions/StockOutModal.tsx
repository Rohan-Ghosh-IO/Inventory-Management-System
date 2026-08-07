import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { performStockOut } from '../../features/transactions/transaction.slice';
import { fetchProducts } from '../../features/products/product.slice';
import { fetchDashboardData } from '../../features/dashboard/dashboard.slice';
import { StockMovementPayload } from '../../services/transaction.api';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { ArrowUpRight, AlertCircle } from 'lucide-react';

interface StockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StockOutModal: React.FC<StockOutModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const productsState = useAppSelector((state) => state.products);
  const { actionLoading } = useAppSelector((state) => state.transactions);

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const selectedProduct = productsState.items.find((p) => p.id === selectedProductId);

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
    const qty = Number(data.quantity);

    if (selectedProduct && qty > selectedProduct.quantity) {
      toast.error(`Cannot issue stock. Available: ${selectedProduct.quantity}, Requested: ${qty}`);
      return;
    }

    const payload = {
      ...data,
      quantity: qty,
    };

    const result = await dispatch(performStockOut(payload));
    if (performStockOut.fulfilled.match(result)) {
      toast.success('Stock issued successfully!');
      reset();
      setSelectedProductId('');
      onClose();
      dispatch(fetchProducts({ page: 1, limit: 100 }));
      dispatch(fetchDashboardData());
      if (onSuccess) onSuccess();
    }
  };

  const productOptions = productsState.items.map((p) => ({
    value: p.id,
    label: `${p.productName} (${p.sku}) — Available: ${p.quantity}`,
  }));

  const { ref: productRef, onChange: productOnChange, ...productRegisterProps } = register('productId', {
    required: 'Please select a product',
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stock Outward (Issue Stock)"
      description="Record dispatched stock items or fulfillment orders from warehouse."
      size="lg"
      icon={
        <div className="h-10 w-10 rounded-xl bg-danger-50 dark:bg-danger-950/30 text-danger-500 flex items-center justify-center font-bold">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      }
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            loading={actionLoading}
            disabled={actionLoading || (selectedProduct ? selectedProduct.quantity <= 0 : false)}
            onClick={handleSubmit(onSubmit)}
          >
            Confirm Stock Out
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
          {...productRegisterProps}
          ref={productRef}
          onChange={(e) => {
            productOnChange(e);
            setSelectedProductId(e.target.value);
          }}
        />

        {/* Current Stock Banner */}
        {selectedProduct && (
          <div className="flex items-center justify-between rounded-xl bg-warning-50 dark:bg-warning-950/30 p-3 border border-warning-200 dark:border-warning-900/50 text-xs">
            <div className="flex items-center gap-2 text-warning-800 dark:text-warning-300">
              <AlertCircle className="h-4 w-4 text-warning-500" />
              <span>Current Stock Level:</span>
            </div>
            <span className="font-bold text-warning-900 dark:text-warning-200 text-sm">
              {selectedProduct.quantity} units
            </span>
          </div>
        )}

        <Input
          label="Quantity to Outward *"
          type="number"
          min="1"
          max={selectedProduct ? selectedProduct.quantity : undefined}
          placeholder="1"
          error={errors.quantity?.message}
          {...register('quantity', {
            required: 'Quantity is required',
            min: { value: 1, message: 'Quantity must be at least 1' },
            validate: (val) =>
              !selectedProduct || Number(val) <= selectedProduct.quantity ||
              `Requested quantity exceeds available stock (${selectedProduct.quantity})`,
          })}
        />

        <Textarea
          label="Remarks / Note (Optional)"
          rows={3}
          placeholder="e.g. Dispatched to order #9023"
          {...register('remarks')}
        />
      </form>
    </Modal>
  );
};
