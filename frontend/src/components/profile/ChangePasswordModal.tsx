import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { authApi, ChangePasswordPayload } from '../../services/auth.api';
import { Key, Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormFields extends ChangePasswordPayload {
  confirmPassword: string;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormFields>();

  const currentPassword = watch('currentPassword');
  const newPassword = watch('newPassword');

  const onSubmit = async (data: FormFields) => {
    if (data.currentPassword === data.newPassword) {
      toast.error('New password cannot be the same as your current password.');
      return;
    }

    try {
      setLoading(true);
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      reset();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password. Check your current password.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Account Password"
      description="Update your password to keep your account secure. Ensure your new password is at least 8 characters long with uppercase, lowercase, and numbers."
      size="md"
      icon={
        <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-500 flex items-center justify-center">
          <Key className="h-5 w-5" />
        </div>
      }
      footer={
        <>
          <Button variant="secondary" size="md" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" loading={loading} onClick={handleSubmit(onSubmit)}>
            Update Password
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <Input
            label="Current Password *"
            type={showCurrent ? 'text' : 'password'}
            placeholder="Enter current password"
            error={errors.currentPassword?.message}
            {...register('currentPassword', { required: 'Current password is required' })}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-content-tertiary hover:text-content transition-colors"
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="New Password *"
            type={showNew ? 'text' : 'password'}
            placeholder="Min 8 chars with A-Z, a-z, 0-9"
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'New password is required',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                message: 'Must be 8+ chars with at least one uppercase, lowercase & number',
              },
              validate: {
                notSame: (val) =>
                  val !== currentPassword || 'New password cannot be the same as your current password',
              },
            })}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-content-tertiary hover:text-content transition-colors"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Input
          label="Confirm New Password *"
          type="password"
          placeholder="Re-enter new password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your new password',
            validate: (val) => val === newPassword || 'Passwords do not match',
          })}
        />
      </form>
    </Modal>
  );
};
