import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { loginUser } from '../../features/auth/auth.slice';
import { LoginPayload } from '../../services/auth.api';
import { ROUTES } from '../../constants';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Eye, EyeOff, Lock, Mail, PackageCheck, ArrowLeft, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
    setTimeout(() => emailRef.current?.focus(), 300);
  }, [setValue]);

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const onSubmit = async (data: LoginPayload) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', normalizedEmail);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    const normalizedData = { ...data, email: normalizedEmail };
    const resultAction = await dispatch(loginUser(normalizedData));
    if (loginUser.fulfilled.match(resultAction)) {
      toast.success('Welcome back! Logged in successfully.');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } else if (loginUser.rejected.match(resultAction)) {
      toast.error((resultAction.payload as string) || 'Invalid email or password');
    }
  };

  const { ref: emailFormRef, ...emailFormProps } = register('email', {
    required: 'Email address is required',
    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Enter a valid email address' },
  });

  return (
    <div className="min-h-screen bg-surface dark:bg-surface flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/10 dark:bg-primary-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-success-400/10 dark:bg-success-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header bar: Back to home + ThemeToggle */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2 text-sm text-content-secondary hover:text-content transition-colors group font-medium"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to home
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
            {/* Logo & title */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="mx-auto h-12 w-12 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/25 mb-4"
              >
                <PackageCheck className="h-6 w-6 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-content dark:text-content tracking-tight"
              >
                Welcome back
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-sm text-content-secondary mt-1"
              >
                Sign in to your IMS account
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Email */}
              <Input
                label="Email address"
                type="email"
                placeholder="admin@inventory.com"
                icon={Mail}
                disabled={loading}
                autoComplete="email"
                error={errors.email?.message}
                {...emailFormProps}
                ref={(el) => {
                  emailFormRef(el);
                  (emailRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
                }}
              />

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-content">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-content-tertiary pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    disabled={loading}
                    autoComplete="current-password"
                    {...register('password', { required: 'Password is required' })}
                    className={`
                      w-full rounded-xl border bg-white dark:bg-[#141414]
                      text-sm text-content dark:text-content
                      placeholder:text-content-tertiary
                      transition-colors duration-150 pl-10 pr-11 py-2.5
                      focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${errors.password
                        ? 'border-danger-400 dark:border-danger-500'
                        : 'border-border dark:border-border hover:border-content-tertiary'
                      }
                    `}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content transition-colors focus:outline-none"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-danger-500 animate-fade-in">{errors.password.message}</p>
                )}
              </div>

              {/* Remember me + forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-border dark:border-border text-primary-500 focus:ring-primary-500/20 rounded-md"
                  />
                  <span className="text-xs text-content-secondary group-hover:text-content transition-colors">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => toast('Forgot password flow coming soon!', { icon: '🔒' })}
                  className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                fullWidth
                className="mt-2"
              >
                Sign In
              </Button>
            </form>

            {/* Register link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-content-secondary">
                Don't have an account?{' '}
                <Link to={ROUTES.REGISTER_ROLE} className="text-primary-500 hover:text-primary-600 font-semibold transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
