import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import { motion } from 'framer-motion';
import {
  PackageCheck,
  Shield,
  BarChart3,
  ArrowRightLeft,
  Download,
  Users,
  ArrowRight,
  Lock,
  Eye,
  FileText,
  Boxes,
  TrendingUp,
  Activity,
  Sparkles,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
  }),
};

const FEATURES = [
  {
    icon: Shield,
    title: 'Role-Based Access Control',
    description: 'Separate Admin and Staff permissions. Admins manage inventory; Staff handle stock movements.',
    color: 'text-primary-500',
    bg: 'bg-primary-50 dark:bg-primary-950/30',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Real-time KPI cards, category valuation charts, stock distribution breakdowns, and audit trails.',
    color: 'text-success-500',
    bg: 'bg-success-50 dark:bg-success-950/30',
  },
  {
    icon: ArrowRightLeft,
    title: 'Stock Transactions',
    description: 'Stock Inward and Outward movements with full audit history, timestamps, and user attribution.',
    color: 'text-warning-500',
    bg: 'bg-warning-50 dark:bg-warning-950/30',
  },
  {
    icon: Download,
    title: 'CSV & PDF Exports',
    description: 'Export products, categories, suppliers, and transactions as CSV spreadsheets or formatted PDF reports.',
    color: 'text-danger-500',
    bg: 'bg-danger-50 dark:bg-danger-950/30',
  },
  {
    icon: Users,
    title: 'Multi-Entity Management',
    description: 'Full CRUD for Products, Categories, and Suppliers with search, filters, pagination, and validation.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
  },
];

const SECURITY_ITEMS = [
  { icon: Lock, text: 'Token Authentication with secure httpOnly cookie management' },
  { icon: Shield, text: 'Role-based permissions — Admin vs Inventory Staff access control' },
  { icon: Eye, text: 'Full audit trail on every stock movement with timestamps' },
  { icon: FileText, text: 'Input validation and sanitization on all API endpoints' },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface dark:bg-surface font-sans">
      {/* ===== NAVBAR ===== */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-border dark:border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white group-hover:scale-105 transition-transform">
              <PackageCheck className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-content tracking-tight">
              IMS
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle size="sm" />
            <Link
              to={ROUTES.LOGIN}
              className="text-xs sm:text-sm font-medium text-content-secondary hover:text-content transition-colors px-2 py-1 whitespace-nowrap"
            >
              Sign in
            </Link>
            <Link
              to={ROUTES.REGISTER_ROLE}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 hidden sm:inline" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-400/10 dark:bg-primary-500/5 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-success-400/10 dark:bg-success-500/5 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-xs font-semibold border border-primary-200 dark:border-primary-900 mb-6">
              <Boxes className="h-3.5 w-3.5" />
              Enterprise Inventory Management
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-content tracking-tight leading-[1.1] max-w-3xl mx-auto"
          >
            Manage your inventory
            <span className="text-gradient-primary block mt-1">with precision</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="mt-6 text-lg text-content-secondary max-w-xl mx-auto leading-relaxed"
          >
            Real-time stock tracking, role-based access control, analytics dashboards, and professional report exports — all in one platform.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to={ROUTES.REGISTER_ROLE}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/20 transition-all hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-secondary dark:bg-[#1F1F1F] border border-border dark:border-border text-content font-semibold text-sm hover:bg-surface-tertiary transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-24 bg-surface-secondary dark:bg-[#0F0F0F] border-t border-b border-border dark:border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-content tracking-tight">
              Everything you need
            </h2>
            <p className="mt-4 text-content-secondary text-lg max-w-lg mx-auto">
              A complete inventory management system with enterprise-grade features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className="group p-6 rounded-2xl bg-white dark:bg-[#141414] border border-border dark:border-border hover:border-primary-200 dark:hover:border-primary-900 transition-colors"
              >
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg} ${feature.color} mb-4`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-content mb-2">{feature.title}</h3>
                <p className="text-sm text-content-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECURITY ===== */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-50 dark:bg-success-950/30 text-success-600 dark:text-success-400 text-xs font-semibold border border-success-200 dark:border-success-900 mb-4">
                <Shield className="h-3.5 w-3.5" />
                Enterprise Security
              </span>
              <h2 className="text-3xl font-extrabold text-content tracking-tight">
                Secure by design
              </h2>
              <p className="mt-4 text-content-secondary leading-relaxed">
                Built with industry-standard security practices including token-based authentication, role-based access control, and comprehensive audit logging.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-4"
            >
              {SECURITY_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-surface-secondary dark:bg-[#141414] border border-border dark:border-border"
                >
                  <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-success-50 dark:bg-success-950/30 text-success-500 flex items-center justify-center">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-content-secondary leading-relaxed pt-1.5">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== DASHBOARD PREVIEW ===== */}
      <section className="py-24 bg-surface-secondary dark:bg-[#0F0F0F] border-t border-b border-border dark:border-border overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-xs font-semibold border border-primary-200 dark:border-primary-900 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Live Visual Interface
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-content tracking-tight">
              Powerful Analytics & Insights
            </h2>
            <p className="mt-4 text-content-secondary text-lg max-w-lg mx-auto">
              Monitor real-time KPIs, track stock movements, and visualize operational data effortlessly.
            </p>
          </motion.div>

          {/* Stylized dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl border border-border dark:border-border/80 bg-white dark:bg-[#121212] p-6 shadow-2xl max-w-5xl mx-auto backdrop-blur-sm relative"
          >
            {/* Top window bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border dark:border-border/60">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs font-medium text-content-tertiary hidden sm:inline">
                  ims.enterprise.app/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {[
                { label: 'Total Valuation', value: '$184,920', change: '+12.4%', color: 'text-emerald-500', icon: TrendingUp },
                { label: 'Active Products', value: '1,482 Items', change: '8 Low Stock', color: 'text-amber-500', icon: Boxes },
                { label: 'Suppliers', value: '42 Verified', change: 'Active Contracts', color: 'text-primary-500', icon: Users },
                { label: 'Monthly Velocity', value: '8,390 Units', change: '+18.2%', color: 'text-indigo-500', icon: Activity },
              ].map((kpi, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface-secondary/70 dark:bg-[#1A1A1A] border border-border/80 dark:border-border/40 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-content-tertiary">{kpi.label}</span>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                  <div className="text-lg font-bold text-content tracking-tight">{kpi.value}</div>
                  <span className={`text-[11px] font-semibold ${kpi.color}`}>{kpi.change}</span>
                </div>
              ))}
            </div>

            {/* Visual Analytics & Recent Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
              {/* Main Chart Card */}
              <div className="lg:col-span-2 p-5 rounded-xl bg-surface-secondary/70 dark:bg-[#1A1A1A] border border-border/80 dark:border-border/40 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-semibold text-content">Stock Distribution Trend</h4>
                    <p className="text-xs text-content-tertiary">Inventory volume over last 6 months</p>
                  </div>
                  <span className="text-xs font-medium text-primary-500 bg-primary-50 dark:bg-primary-950/40 px-2 py-1 rounded-md">2026 Q3</span>
                </div>

                <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                  {[
                    { month: 'Mar', height: '45%', val: '4.2k' },
                    { month: 'Apr', height: '65%', val: '5.8k' },
                    { month: 'May', height: '55%', val: '5.1k' },
                    { month: 'Jun', height: '85%', val: '7.9k' },
                    { month: 'Jul', height: '70%', val: '6.4k' },
                    { month: 'Aug', height: '95%', val: '8.3k' },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 dark:from-primary-600/80 dark:to-primary-400 group-hover:brightness-110 transition-all shadow-sm" style={{ height: bar.height }}>
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-content text-surface text-[10px] font-bold px-1.5 py-0.5 rounded shadow transition-opacity whitespace-nowrap">
                          {bar.val}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-content-tertiary">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Activity Feed Card */}
              <div className="p-5 rounded-xl bg-surface-secondary/70 dark:bg-[#1A1A1A] border border-border/80 dark:border-border/40 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-content">Recent Movements</h4>
                  <ArrowRightLeft className="h-4 w-4 text-content-tertiary" />
                </div>

                <div className="space-y-3 my-2">
                  {[
                    { action: 'Stock Inward', item: 'Dell XPS 15 (x20)', time: '2m ago', type: 'in' },
                    { action: 'Stock Outward', item: 'Logistics Hub A (x5)', time: '14m ago', type: 'out' },
                    { action: 'Product Added', item: 'Ergonomic Chair', time: '1h ago', type: 'new' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface dark:bg-[#141414] border border-border/40">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-2 w-2 rounded-full ${act.type === 'in' ? 'bg-emerald-500' : act.type === 'out' ? 'bg-amber-500' : 'bg-primary-500'}`} />
                        <div>
                          <div className="font-semibold text-content text-[11px]">{act.action}</div>
                          <div className="text-[10px] text-content-tertiary truncate max-w-[110px]">{act.item}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-content-tertiary font-mono">{act.time}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center border-t border-border/40">
                  <span className="text-[11px] text-primary-500 font-semibold cursor-pointer hover:underline">
                    View Full Audit Trail →
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== PROFESSIONAL FOOTER ===== */}
      <footer className="bg-white dark:bg-[#0A0A0A] border-t border-border dark:border-border pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border dark:border-border/60">
            {/* Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-white shadow-md shadow-primary-500/20">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-base text-content tracking-tight">
                  Inventory Management System
                </span>
              </Link>
              <p className="text-sm text-content-secondary leading-relaxed max-w-sm">
                Enterprise-grade platform designed for precision inventory control, real-time tracking, role-based security, and automated report generation.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </div>
            </div>

            {/* Column 1: Core Platform */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-content mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm text-content-secondary">
                <li>
                  <Link to={ROUTES.LOGIN} className="hover:text-primary-500 transition-colors">
                    Dashboard Overview
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.LOGIN} className="hover:text-primary-500 transition-colors">
                    Stock Management
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.LOGIN} className="hover:text-primary-500 transition-colors">
                    Transaction Logs
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.LOGIN} className="hover:text-primary-500 transition-colors">
                    Analytics & Reports
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Security & Roles */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-content mb-4">Security</h4>
              <ul className="space-y-2.5 text-sm text-content-secondary">
                <li>
                  <span className="hover:text-primary-500 transition-colors cursor-default">
                    Role-Based Access
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary-500 transition-colors cursor-default">
                    Audit Trail Logging
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary-500 transition-colors cursor-default">
                    Secure Authentication
                  </span>
                </li>
                <li>
                  <span className="hover:text-primary-500 transition-colors cursor-default">
                    Data Encryption
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Access */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-content mb-4">Account</h4>
              <ul className="space-y-2.5 text-sm text-content-secondary">
                <li>
                  <Link to={ROUTES.LOGIN} className="hover:text-primary-500 transition-colors flex items-center gap-1.5">
                    Sign In <ArrowRight className="h-3 w-3" />
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.REGISTER_ROLE} className="hover:text-primary-500 transition-colors flex items-center gap-1.5">
                    Register Account <ArrowRight className="h-3 w-3" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-tertiary">
            <p>© {new Date().getFullYear()} Inventory Management System (IMS). All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-content transition-colors cursor-pointer">Privacy Policy</span>
              <span className="hover:text-content transition-colors cursor-pointer">Terms of Service</span>
              <span className="hover:text-content transition-colors cursor-pointer">Security Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

