import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Supplier, PaginationMeta } from '../../types';
import { supplierApi, GetSuppliersQueryParams, SupplierPayload } from '../../services/supplier.api';
import { sanitizeErrorMessage } from '../../utils/error.util';

interface SupplierState {
  items: Supplier[];
  meta: PaginationMeta;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: SupplierState = {
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

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async (params: GetSuppliersQueryParams | undefined, { rejectWithValue }) => {
    try {
      const response = await supplierApi.getSuppliers(params);
      return {
        items: response.data || [],
        meta: response.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to load suppliers.'));
    }
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/createSupplier',
  async (payload: SupplierPayload, { rejectWithValue }) => {
    try {
      const response = await supplierApi.createSupplier(payload);
      return response.data!;
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to save supplier.'));
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/updateSupplier',
  async ({ id, payload }: { id: string; payload: Partial<SupplierPayload> }, { rejectWithValue }) => {
    try {
      const response = await supplierApi.updateSupplier(id, payload);
      return response.data!;
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to update supplier.'));
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'suppliers/deleteSupplier',
  async (id: string, { rejectWithValue }) => {
    try {
      await supplierApi.deleteSupplier(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to delete supplier.'));
    }
  }
);

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    clearSupplierError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Suppliers
    builder.addCase(fetchSuppliers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSuppliers.fulfilled, (state, action: PayloadAction<{ items: Supplier[]; meta: PaginationMeta }>) => {
      state.loading = false;
      state.items = action.payload.items;
      state.meta = action.payload.meta;
    });
    builder.addCase(fetchSuppliers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Supplier
    builder.addCase(createSupplier.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(createSupplier.fulfilled, (state, action: PayloadAction<Supplier>) => {
      state.actionLoading = false;
      if (action.payload) {
        state.items.unshift(action.payload);
        state.meta.total += 1;
      }
    });
    builder.addCase(createSupplier.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Update Supplier
    builder.addCase(updateSupplier.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(updateSupplier.fulfilled, (state, action: PayloadAction<Supplier>) => {
      state.actionLoading = false;
      if (action.payload) {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      }
    });
    builder.addCase(updateSupplier.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Delete Supplier
    builder.addCase(deleteSupplier.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(deleteSupplier.fulfilled, (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.meta.total = Math.max(0, state.meta.total - 1);
    });
    builder.addCase(deleteSupplier.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearSupplierError } = supplierSlice.actions;
export default supplierSlice.reducer;
