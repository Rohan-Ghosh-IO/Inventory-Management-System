import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { registerUser } from '../../features/auth/auth.slice';
import { RegisterPayload } from '../../services/auth.api';
import { ROUTES } from '../../constants';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  Eye, EyeOff, Lock, Mail, User, Shield, ArrowLeft,
  CheckCircle,
} from 'lucide-react';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/* Password strength helper */
const getStrength = (pw: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  const map: Record<number, { label: string; color: string }> = {
    0: { label: 'Too weak', color: 'bg-danger-500' },
    1: { label: 'Weak', color: 'bg-danger-400' },
    2: { label: 'Fair', color: 'bg-warning-400' },
    3: { label: 'Good', color: 'bg-warning-500' },
    4: { label: 'Strong', color: 'bg-success-400' },
    5: { label: 'Very strong', color: 'bg-success-500' },
  };
  return { score, ...map[score] };
};

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const { isAuthenticated, loading } = useAppSelector((s) => s.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedRole: 'ADMIN' | 'USER' =
    role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({ mode: 'onChange' });

  const passwordValue = watch('password', '');
  const strength = getStrength(passwordValue || '');

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true });
    // If invalid role param, redirect to role-selector
    if (role && !['admin', 'user'].includes(role.toLowerCase())) {
      navigate(ROUTES.REGISTER_ROLE, { replace: true });
    }
  }, [isAuthenticated, navigate, role]);

  const onSubmit = async (data: RegisterFormValues) => {
    const payload: RegisterPayload = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: selectedRole,
    };

    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      setSuccess(true);
      toast.success('Account created! Please sign in.');
      setTimeout(() => navigate(ROUTES.LOGIN, { replace: true }), 1800);
    } else if (registerUser.rejected.match(result)) {
      toast.error((result.payload as string) || 'Registration failed');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface dark:bg-surface flex items-center justify-center font-sans p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4 max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="mx-auto h-20 w-20 rounded-full bg-success-50 dark:bg-success-950/30 border border-success-200 dark:border-success-900 flex items-center justify-center"
          >
            <CheckCircle className="h-10 w-10 text-success-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-content">Account Created!</h2>
          <p className="text-content-secondary text-sm">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-400/10 dark:bg-primary-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-success-400/10 dark:bg-success-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header bar: Back + ThemeToggle */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to={ROUTES.REGISTER_ROLE}
              className="inline-flex items-center gap-2 text-sm text-content-secondary hover:text-content transition-colors group font-medium"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Change account type
            </Link>
          </motion.div>
          <ThemeToggle size="sm" />
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <Card variant="glass" padding="lg" className="shadow-2xl">
            {/* Header */}
            <div className="text-center mb-7">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="mx-auto h-12 w-12 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/25 mb-4"
              >
                {selectedRole === 'ADMIN' ? (
                  <Shield className="h-6 w-6 text-white" />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </motion.div>
              <h1 className="text-2xl font-bold text-content tracking-tight">Create Account</h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant={selectedRole === 'ADMIN' ? 'primary' : 'success'} size="md">
                  {selectedRole === 'ADMIN' ? 'Administrator' : 'Inventory Staff'}
                </Badge>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Name */}
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                icon={User}
                disabled={loading}
                error={errors.name?.message}
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 60, message: 'Name too long' },
                })}
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                disabled={loading}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Enter a valid email' },
                })}
              />

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-content">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
                    disabled={loading}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'At least 8 characters' },
                    })}
                    className={`
                      w-full rounded-xl border bg-white dark:bg-[#141414]
                      text-sm text-content dark:text-content
                      placeholder:text-content-tertiary
                      transition-colors duration-150 pl-10 pr-11 py-2.5
                      focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${errors.password ? 'border-danger-400 dark:border-danger-500' : 'border-border dark:border-border'}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content transition-colors focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {passwordValue && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-surface-tertiary dark:bg-[#252525]'}`} />
                      ))}
                    </div>
                    <p className={`text-xs ${strength.score >= 4 ? 'text-success-600 dark:text-success-400' : strength.score >= 3 ? 'text-warning-600' : 'text-danger-500'}`}>
                      {strength.label}
                    </p>
                  </motion.div>
                )}

                {errors.password && (
                  <p className="text-xs text-danger-500 animate-fade-in">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-content">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary pointer-events-none" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    disabled={loading}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (val) => val === passwordValue || 'Passwords do not match',
                    })}
                    className={`
                      w-full rounded-xl border bg-white dark:bg-[#141414]
                      text-sm text-content dark:text-content
                      placeholder:text-content-tertiary
                      transition-colors duration-150 pl-10 pr-11 py-2.5
                      focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${errors.confirmPassword ? 'border-danger-400 dark:border-danger-500' : 'border-border dark:border-border'}
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content transition-colors focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-danger-500 animate-fade-in">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                fullWidth
                className="mt-2"
              >
                {`Create ${selectedRole === 'ADMIN' ? 'Administrator' : 'Staff'} Account`}
              </Button>
            </form>

            {/* Sign-in link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-content-secondary">
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN} className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
