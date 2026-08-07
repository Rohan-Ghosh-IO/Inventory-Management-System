import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description="This action cannot be undone."
      size="sm"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 dark:bg-danger-950/50 text-danger-500">
          <AlertTriangle className="h-5 w-5" />
        </div>
      }
      footer={
        <>
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-content-secondary">{message}</p>
    </Modal>
  );
};
