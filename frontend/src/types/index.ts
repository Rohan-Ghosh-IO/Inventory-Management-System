export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
export type TransactionType = 'IN' | 'OUT';

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface Supplier {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  productName: string;
  sku: string;
  description?: string | null;
  imageUrl?: string | null;
  quantity: number;
  lowStockThreshold: number;
  unitPrice: number;
  status: ProductStatus;
  category: {
    id: string;
    name: string;
  };
  supplier: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  type: TransactionType;
  quantity: number;
  remarks?: string | null;
  createdAt: string;
  product: Product;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: any;
  timestamp: string;
}
