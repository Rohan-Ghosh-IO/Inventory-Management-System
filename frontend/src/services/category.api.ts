import { inventoryApiClient } from './api-client';
import { ApiResponse, Category } from '../types';

export interface GetCategoriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'name' | 'createdAt';
  order?: 'asc' | 'desc';
}

export interface CategoryPayload {
  name: string;
  description?: string;
}

export const categoryApi = {
  getCategories: async (params?: GetCategoriesQueryParams): Promise<ApiResponse<Category[]>> => {
    const response = await inventoryApiClient.get<ApiResponse<Category[]>>('/categories', { params });
    return response.data;
  },

  getCategoryById: async (id: string): Promise<ApiResponse<Category>> => {
    const response = await inventoryApiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (payload: CategoryPayload): Promise<ApiResponse<Category>> => {
    const response = await inventoryApiClient.post<ApiResponse<Category>>('/categories', payload);
    return response.data;
  },

  updateCategory: async (id: string, payload: Partial<CategoryPayload>): Promise<ApiResponse<Category>> => {
    const response = await inventoryApiClient.put<ApiResponse<Category>>(`/categories/${id}`, payload);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<ApiResponse<void>> => {
    const response = await inventoryApiClient.delete<ApiResponse<void>>(`/categories/${id}`);
    return response.data;
  },

  exportCategoriesCsv: async (search?: string): Promise<Blob> => {
    const response = await inventoryApiClient.get('/categories/export', {
      params: { search },
      responseType: 'blob',
    });
    return response.data;
  },

  exportCategoriesPdf: async (search?: string): Promise<Blob> => {
    const response = await inventoryApiClient.get('/categories/export/pdf', {
      params: { search },
      responseType: 'blob',
    });
    return response.data;
  },
};
