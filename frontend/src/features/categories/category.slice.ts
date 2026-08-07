import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category, PaginationMeta } from '../../types';
import { categoryApi, GetCategoriesQueryParams, CategoryPayload } from '../../services/category.api';
import { sanitizeErrorMessage } from '../../utils/error.util';

interface CategoryState {
  items: Category[];
  meta: PaginationMeta;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
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

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params: GetCategoriesQueryParams | undefined, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getCategories(params);
      return {
        items: response.data || [],
        meta: response.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to load categories.'));
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (payload: CategoryPayload, { rejectWithValue }) => {
    try {
      const response = await categoryApi.createCategory(payload);
      return response.data!;
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to save category.'));
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, payload }: { id: string; payload: Partial<CategoryPayload> }, { rejectWithValue }) => {
    try {
      const response = await categoryApi.updateCategory(id, payload);
      return response.data!;
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to update category.'));
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      await categoryApi.deleteCategory(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(sanitizeErrorMessage(err, 'Unable to delete category.'));
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action: PayloadAction<{ items: Category[]; meta: PaginationMeta }>) => {
      state.loading = false;
      state.items = action.payload.items;
      state.meta = action.payload.meta;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Category
    builder.addCase(createCategory.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
      state.actionLoading = false;
      if (action.payload) {
        state.items.unshift(action.payload);
        state.meta.total += 1;
      }
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Update Category
    builder.addCase(updateCategory.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
      state.actionLoading = false;
      if (action.payload) {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      }
    });
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Delete Category
    builder.addCase(deleteCategory.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
      state.actionLoading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.meta.total = Math.max(0, state.meta.total - 1);
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
