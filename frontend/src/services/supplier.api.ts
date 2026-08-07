import { inventoryApiClient } from './api-client';
import { ApiResponse, Supplier } from '../types';

export interface GetSuppliersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'name' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface SupplierPayload {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const supplierApi = {
  getSuppliers: async (params?: GetSuppliersQueryParams): Promise<ApiResponse<Supplier[]>> => {
    const response = await inventoryApiClient.get<ApiResponse<Supplier[]>>('/suppliers', { params });
    return response.data;
  },

  getSupplierById: async (id: string): Promise<ApiResponse<Supplier>> => {
    const response = await inventoryApiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
    return response.data;
  },

  createSupplier: async (payload: SupplierPayload): Promise<ApiResponse<Supplier>> => {
    const response = await inventoryApiClient.post<ApiResponse<Supplier>>('/suppliers', payload);
    return response.data;
  },

  updateSupplier: async (id: string, payload: Partial<SupplierPayload>): Promise<ApiResponse<Supplier>> => {
    const response = await inventoryApiClient.put<ApiResponse<Supplier>>(`/suppliers/${id}`, payload);
    return response.data;
  },

  deleteSupplier: async (id: string): Promise<ApiResponse<void>> => {
    const response = await inventoryApiClient.delete<ApiResponse<void>>(`/suppliers/${id}`);
    return response.data;
  },

  exportSuppliersCsv: async (search?: string): Promise<Blob> => {
    const response = await inventoryApiClient.get('/suppliers/export', {
      params: { search },
      responseType: 'blob',
    });
    return response.data;
  },

  exportSuppliersPdf: async (search?: string): Promise<Blob> => {
    const response = await inventoryApiClient.get('/suppliers/export/pdf', {
      params: { search },
      responseType: 'blob',
    });
    return response.data;
  },
};
