import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/auth.slice';
import dashboardReducer from '../features/dashboard/dashboard.slice';
import productReducer from '../features/products/product.slice';
import categoryReducer from '../features/categories/category.slice';
import supplierReducer from '../features/suppliers/supplier.slice';
import transactionReducer from '../features/transactions/transaction.slice';
import themeReducer from '../features/theme/theme.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  products: productReducer,
  categories: categoryReducer,
  suppliers: supplierReducer,
  transactions: transactionReducer,
  theme: themeReducer,
});
