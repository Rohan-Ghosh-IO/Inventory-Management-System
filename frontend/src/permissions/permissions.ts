export const PERMISSIONS = {
  // Products
  PRODUCTS_VIEW: 'products:view',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_EDIT: 'products:edit',
  PRODUCTS_DELETE: 'products:delete',
  PRODUCTS_EXPORT: 'products:export',

  // Categories
  CATEGORIES_VIEW: 'categories:view',
  CATEGORIES_CREATE: 'categories:create',
  CATEGORIES_EDIT: 'categories:edit',
  CATEGORIES_DELETE: 'categories:delete',
  CATEGORIES_EXPORT: 'categories:export',

  // Suppliers
  SUPPLIERS_VIEW: 'suppliers:view',
  SUPPLIERS_CREATE: 'suppliers:create',
  SUPPLIERS_EDIT: 'suppliers:edit',
  SUPPLIERS_DELETE: 'suppliers:delete',
  SUPPLIERS_EXPORT: 'suppliers:export',

  // Transactions
  TRANSACTIONS_VIEW: 'transactions:view',
  TRANSACTIONS_STOCK_IN: 'transactions:stock_in',
  TRANSACTIONS_STOCK_OUT: 'transactions:stock_out',
  TRANSACTIONS_EXPORT: 'transactions:export',

  // Reports & Analytics
  REPORTS_VIEW: 'reports:view',
  ANALYTICS_VIEW: 'analytics:view',

  // Global Features
  EXPORT_DATA: 'data:export',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
