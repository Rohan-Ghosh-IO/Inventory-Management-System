export const ENV = {
  AUTH_API_URL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5001/api/v1',
  INVENTORY_API_URL: import.meta.env.VITE_INVENTORY_API_URL || 'http://localhost:5002/api/v1',
  APP_NAME: 'Inventory Management System',
  DEFAULT_PAGE_SIZE: 10,
} as const;
