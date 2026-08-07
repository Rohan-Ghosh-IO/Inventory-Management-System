import express from 'express';

import { authenticateJwt, authorizeRoles, UserRole } from '@inventory/shared';

import {
  getSummaryController,
  getStockStatusController,
  getRecentTransactionsController,
  getTopProductsController,
  getCategoryValueController,
  getLowStockController,
} from '../controllers/dashboard.controller';

const router = express.Router();

const dashboardAuth = [authenticateJwt, authorizeRoles(UserRole.ADMIN, UserRole.USER)];

router.get('/summary', ...dashboardAuth, getSummaryController);
router.get('/stock-status', ...dashboardAuth, getStockStatusController);
router.get('/recent-transactions', ...dashboardAuth, getRecentTransactionsController);
router.get('/top-products', ...dashboardAuth, getTopProductsController);
router.get('/category-value', ...dashboardAuth, getCategoryValueController);
router.get('/low-stock', ...dashboardAuth, getLowStockController);

export default router;
