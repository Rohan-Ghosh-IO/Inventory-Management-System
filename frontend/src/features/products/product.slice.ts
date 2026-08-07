import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, PaginationMeta } from '../../types';
import { productApi, GetProductsQueryParams, ProductPayload } from '../../services/product.api';
import { sanitizeErrorMessage } from '../../utils/error.util';

interface ProductState {
  items: Product[];
  meta: PaginationMeta;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  meta: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  loading: false,
  actionLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: GetProductsQueryParams | undefined, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(params);
      return {
        items: response.data || [],
        meta: response.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to load products.'));
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (payload: ProductPayload, { rejectWithValue }) => {
    try {
      const response = await productApi.createProduct(payload);
      return response.data!;
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to save product.'));
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, payload }: { id: string; payload: Partial<ProductPayload> }, { rejectWithValue }) => {
    try {
      const response = await productApi.updateProduct(id, payload);
      return response.data!;
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to update product.'));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await productApi.deleteProduct(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to delete product.'));
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{ items: Product[]; meta: PaginationMeta }>) => {
      state.loading = false;
      state.items = action.payload.items;
      state.meta = action.payload.meta;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Product
    builder.addCase(createProduct.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
      state.actionLoading = false;
      if (action.payload) {
        state.items.unshift(action.payload);
        state.meta.total += 1;
      }
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Update Product
    builder.addCase(updateProduct.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
      state.actionLoading = false;
      if (action.payload) {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      }
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Delete Product
    builder.addCase(deleteProduct.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.meta.total = Math.max(0, state.meta.total - 1);
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
