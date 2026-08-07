import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InventoryTransaction, PaginationMeta } from '../../types';
import {
  transactionApi,
  GetTransactionsQueryParams,
  StockMovementPayload,
  StockMovementResponseData,
} from '../../services/transaction.api';

interface TransactionState {
  items: InventoryTransaction[];
  meta: PaginationMeta;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
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

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params: GetTransactionsQueryParams | undefined, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getTransactions(params);
      return {
        items: response.data || [],
        meta: response.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const performStockIn = createAsyncThunk(
  'transactions/performStockIn',
  async (payload: StockMovementPayload, { rejectWithValue }) => {
    try {
      const response = await transactionApi.stockIn(payload);
      return response.data!;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add stock');
    }
  }
);

export const performStockOut = createAsyncThunk(
  'transactions/performStockOut',
  async (payload: StockMovementPayload, { rejectWithValue }) => {
    try {
      const response = await transactionApi.stockOut(payload);
      return response.data!;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to issue stock');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Transactions
    builder.addCase(fetchTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<{ items: InventoryTransaction[]; meta: PaginationMeta }>) => {
      state.loading = false;
      state.items = action.payload.items;
      state.meta = action.payload.meta;
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Stock IN
    builder.addCase(performStockIn.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(performStockIn.fulfilled, (state) => {
      state.actionLoading = false;
    });
    builder.addCase(performStockIn.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Stock OUT
    builder.addCase(performStockOut.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(performStockOut.fulfilled, (state) => {
      state.actionLoading = false;
    });
    builder.addCase(performStockOut.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearTransactionError } = transactionSlice.actions;
export default transactionSlice.reducer;
