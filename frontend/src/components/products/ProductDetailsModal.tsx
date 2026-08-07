import React from 'react';
import { Product } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Package, Layers, Truck } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onStockIn?: () => void;
  onStockOut?: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onStockIn,
  onStockOut,
}) => {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.productName}
      description={`SKU: ${product.sku}`}
      size="lg"
      icon={
        <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-500 flex items-center justify-center font-bold">
          <Package className="h-5 w-5" />
        </div>
      }
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          {onStockIn && (
            <Button
              variant="success"
              size="sm"
              onClick={() => {
                onClose();
                onStockIn();
              }}
            >
              + Stock In
            </Button>
          )}
          {onStockOut && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onClose();
                onStockOut();
              }}
            >
              - Stock Out
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        {/* Product Image */}
        {product.imageUrl && (
          <div className="w-full h-48 rounded-xl bg-slate-50 dark:bg-[#1A1A1E] border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-2">
            <img
              src={product.imageUrl}
              alt={product.productName}
              loading="lazy"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-secondary dark:bg-[#1A1A1A] border border-border-secondary dark:border-border">
            <span className="text-xs text-content-tertiary block mb-1">Available Stock</span>
            <div className="flex items-center justify-between">
              <span className="text-xl font-extrabold text-content">
                {product.quantity} units
              </span>
              <StatusBadge status={product.status} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary dark:bg-[#1A1A1A] border border-border-secondary dark:border-border">
            <span className="text-xs text-content-tertiary block mb-1">Unit Price</span>
            <span className="text-xl font-extrabold text-primary-600 dark:text-primary-400">
              ${product.unitPrice?.toFixed(2)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary dark:bg-[#1A1A1A] border border-border-secondary dark:border-border">
            <span className="text-xs text-content-tertiary block mb-1">Category</span>
            <span className="text-xs font-bold text-content flex items-center gap-1.5 mt-1">
              <Layers className="h-3.5 w-3.5 text-purple-500" />
              {product.category?.name || 'Uncategorized'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-secondary dark:bg-[#1A1A1A] border border-border-secondary dark:border-border">
            <span className="text-xs text-content-tertiary block mb-1">Supplier</span>
            <span className="text-xs font-bold text-content flex items-center gap-1.5 mt-1">
              <Truck className="h-3.5 w-3.5 text-sky-500" />
              {product.supplier?.name || 'Unassigned'}
            </span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="p-3.5 rounded-xl bg-surface-secondary dark:bg-[#1A1A1A] border border-border-secondary dark:border-border">
            <span className="text-xs text-content-tertiary block mb-1 font-medium">Description</span>
            <p className="text-xs text-content-secondary leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
