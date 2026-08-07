import { inventoryApiClient } from './api-client';
import { ApiResponse, Product, ProductStatus } from '../types';

export interface GetProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  supplierId?: string;
  status?: ProductStatus;
  sort?: 'productName' | 'unitPrice' | 'quantity' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface ProductPayload {
  productName: string;
  sku: string;
  description?: string;
  quantity: number;
  lowStockThreshold: number;
  unitPrice: number;
  supplierId: string;
  categoryId: string;
  image?: File | null;
  removeImage?: boolean;
}

export const productApi = {
  getProducts: async (params?: GetProductsQueryParams): Promise<ApiResponse<Product[]>> => {
    const response = await inventoryApiClient.get<ApiResponse<Product[]>>('/products', { params });
    return response.data;
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await inventoryApiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (payload: ProductPayload): Promise<ApiResponse<Product>> => {
    if (payload.image instanceof File) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'image' && value instanceof File) {
            formData.append('image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await inventoryApiClient.post<ApiResponse<Product>>('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }
    const response = await inventoryApiClient.post<ApiResponse<Product>>('/products', payload);
    return response.data;
  },

  updateProduct: async (id: string, payload: Partial<ProductPayload>): Promise<ApiResponse<Product>> => {
    if (payload.image instanceof File || payload.removeImage) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'image' && value instanceof File) {
            formData.append('image', value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await inventoryApiClient.put<ApiResponse<Product>>(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }
    const response = await inventoryApiClient.put<ApiResponse<Product>>(`/products/${id}`, payload);
    return response.data;
  },

  deleteProductImage: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await inventoryApiClient.delete<ApiResponse<Product>>(`/products/${id}/image`);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    const response = await inventoryApiClient.delete<ApiResponse<void>>(`/products/${id}`);
    return response.data;
  },

  exportProductsCsv: async (params?: {
    search?: string;
    categoryId?: string;
    supplierId?: string;
    status?: ProductStatus;
  }): Promise<Blob> => {
    const response = await inventoryApiClient.get('/products/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  exportProductsPdf: async (params?: {
    search?: string;
    categoryId?: string;
    supplierId?: string;
    status?: ProductStatus;
  }): Promise<Blob> => {
    const response = await inventoryApiClient.get('/products/export/pdf', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  getProductQrCodeBlob: async (id: string): Promise<Blob> => {
    const response = await inventoryApiClient.get(`/products/${id}/qrcode`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
