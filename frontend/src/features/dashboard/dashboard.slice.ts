import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  dashboardApi,
  DashboardSummaryData,
  StockStatusSummaryData,
  TopProductData,
  CategoryValueData,
} from '../../services/dashboard.api';
import { InventoryTransaction, Product } from '../../types';

interface DashboardState {
  summary: DashboardSummaryData | null;
  stockStatus: StockStatusSummaryData | null;
  recentTransactions: InventoryTransaction[];
  topProducts: TopProductData[];
  categoryValue: CategoryValueData[];
  lowStockProducts: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  stockStatus: null,
  recentTransactions: [],
  topProducts: [],
  categoryValue: [],
  lowStockProducts: [],
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const [summaryRes, stockStatusRes, recentRes, topProductsRes, categoryValueRes, lowStockRes] =
        await Promise.all([
          dashboardApi.getSummary(),
          dashboardApi.getStockStatus(),
          dashboardApi.getRecentTransactions(),
          dashboardApi.getTopProducts(),
          dashboardApi.getCategoryValue(),
          dashboardApi.getLowStock(),
        ]);

      return {
        summary: summaryRes.data!,
        stockStatus: stockStatusRes.data!,
        recentTransactions: recentRes.data || [],
        topProducts: topProductsRes.data || [],
        categoryValue: categoryValueRes.data || [],
        lowStockProducts: lowStockRes.data || [],
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load dashboard metrics');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDashboardData.fulfilled, (state, action) => {
      state.loading = false;
      state.summary = action.payload.summary;
      state.stockStatus = action.payload.stockStatus;
      state.recentTransactions = action.payload.recentTransactions;
      state.topProducts = action.payload.topProducts;
      state.categoryValue = action.payload.categoryValue;
      state.lowStockProducts = action.payload.lowStockProducts;
    });
    builder.addCase(fetchDashboardData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default dashboardSlice.reducer;
