/**
 * Design Token System
 * These values mirror the CSS custom properties defined in index.css.
 * Use these for any JS-level styling (e.g., Recharts, inline calculations).
 * For Tailwind classes, use the semantic tokens in tailwind.config.js instead.
 */

export const colors = {
  // Brand
  primary: '#0EA5E9',
  primaryLight: '#38BDF8',
  primaryDark: '#0284C7',

  // Semantic
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',

  // Light theme surfaces
  light: {
    surface: '#FFFFFF',
    surfaceSecondary: '#FAFAFA',
    surfaceTertiary: '#F8FAFC',
    surfaceElevated: '#FFFFFF',
    border: '#E5E7EB',
    borderSecondary: '#F3F4F6',
    content: '#111827',
    contentSecondary: '#6B7280',
    contentTertiary: '#9CA3AF',
  },

  // Dark theme surfaces
  dark: {
    surface: '#0A0A0A',
    surfaceSecondary: '#141414',
    surfaceTertiary: '#1A1A1A',
    surfaceElevated: '#1F1F1F',
    border: '#2D2D2D',
    borderSecondary: '#232323',
    content: '#F9FAFB',
    contentSecondary: '#9CA3AF',
    contentTertiary: '#6B7280',
  },

  // Chart palette (consistent across themes)
  chart: {
    blue: '#0EA5E9',
    green: '#22C55E',
    purple: '#8B5CF6',
    pink: '#EC4899',
    amber: '#F59E0B',
    cyan: '#06B6D4',
    red: '#EF4444',
    indigo: '#6366F1',
  },
} as const;

export const borderRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1rem',
  '3xl': '1.25rem',
  full: '9999px',
} as const;

export const shadows = {
  subtle: '0 1px 2px 0 rgba(0,0,0,0.05)',
  elevated: '0 4px 20px -2px rgba(0,0,0,0.08), 0 2px 6px -1px rgba(0,0,0,0.04)',
  glowPrimary: '0 0 20px -5px rgba(14,165,233,0.3)',
  glowSuccess: '0 0 20px -5px rgba(34,197,94,0.3)',
  glowDanger: '0 0 20px -5px rgba(239,68,68,0.3)',
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
} as const;
