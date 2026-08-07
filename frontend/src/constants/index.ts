export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER_ROLE: '/register',
  REGISTER: '/register/:role',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SUPPLIERS: '/suppliers',
  TRANSACTIONS: '/transactions',
  PROFILE: '/profile',
} as const;

export const PAGE_SIZE = 10;
export const TOAST_DURATION = 4000;

export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;
