import { inventoryApiClient } from './api-client';
import { ApiResponse, InventoryTransaction, Product, TransactionType } from '../types';

export interface GetTransactionsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: TransactionType;
  productId?: string;
  categoryId?: string;
  supplierId?: string;
  sort?: 'createdAt';
  order?: 'asc' | 'desc';
}

export interface StockMovementPayload {
  productId: string;
  quantity: number;
  remarks?: string;
}

export interface StockMovementResponseData {
  transaction: InventoryTransaction;
  product: Product;
}

export const transactionApi = {
  getTransactions: async (params?: GetTransactionsQueryParams): Promise<ApiResponse<InventoryTransaction[]>> => {
    const response = await inventoryApiClient.get<ApiResponse<InventoryTransaction[]>>('/transactions', { params });
    return response.data;
  },

  getTransactionById: async (id: string): Promise<ApiResponse<InventoryTransaction>> => {
    const response = await inventoryApiClient.get<ApiResponse<InventoryTransaction>>(`/transactions/${id}`);
    return response.data;
  },

  stockIn: async (payload: StockMovementPayload): Promise<ApiResponse<StockMovementResponseData>> => {
    const response = await inventoryApiClient.post<ApiResponse<StockMovementResponseData>>('/transactions/in', payload);
    return response.data;
  },

  stockOut: async (payload: StockMovementPayload): Promise<ApiResponse<StockMovementResponseData>> => {
    const response = await inventoryApiClient.post<ApiResponse<StockMovementResponseData>>('/transactions/out', payload);
    return response.data;
  },

  exportTransactionsCsv: async (params?: {
    search?: string;
    type?: TransactionType;
    productId?: string;
    categoryId?: string;
    supplierId?: string;
  }): Promise<Blob> => {
    const response = await inventoryApiClient.get('/transactions/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  exportTransactionsPdf: async (params?: {
    search?: string;
    type?: TransactionType;
    productId?: string;
    categoryId?: string;
    supplierId?: string;
  }): Promise<Blob> => {
    const response = await inventoryApiClient.get('/transactions/export/pdf', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
