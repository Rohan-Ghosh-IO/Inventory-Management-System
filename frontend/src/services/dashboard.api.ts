import { inventoryApiClient } from './api-client';
import { ApiResponse, InventoryTransaction, Product } from '../types';

export interface DashboardSummaryData {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  totalInventoryValue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface StockStatusSummaryData {
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export interface TopProductData {
  product: Product;
  quantity: number;
  inventoryValue: number;
}

export interface CategoryValueData {
  categoryId: string;
  category: string;
  inventoryValue: number;
  productCount: number;
}

export const dashboardApi = {
  getSummary: async (): Promise<ApiResponse<DashboardSummaryData>> => {
    const response = await inventoryApiClient.get<ApiResponse<DashboardSummaryData>>('/dashboard/summary');
    return response.data;
  },

  getStockStatus: async (): Promise<ApiResponse<StockStatusSummaryData>> => {
    const response = await inventoryApiClient.get<ApiResponse<StockStatusSummaryData>>('/dashboard/stock-status');
    return response.data;
  },

  getRecentTransactions: async (): Promise<ApiResponse<InventoryTransaction[]>> => {
    const response = await inventoryApiClient.get<ApiResponse<InventoryTransaction[]>>('/dashboard/recent-transactions');
    return response.data;
  },

  getTopProducts: async (): Promise<ApiResponse<TopProductData[]>> => {
    const response = await inventoryApiClient.get<ApiResponse<TopProductData[]>>('/dashboard/top-products');
    return response.data;
  },

  getCategoryValue: async (): Promise<ApiResponse<CategoryValueData[]>> => {
    const response = await inventoryApiClient.get<ApiResponse<CategoryValueData[]>>('/dashboard/category-value');
    return response.data;
  },

  getLowStock: async (): Promise<ApiResponse<Product[]>> => {
    const response = await inventoryApiClient.get<ApiResponse<Product[]>>('/dashboard/low-stock');
    return response.data;
  },
};
