import express from 'express';

import {
  validateRequest,
  authenticateJwt,
  authorizeRoles,
  UserRole,
  uuidParamSchema,
} from '@inventory/shared';

import {
  stockInSchema,
  stockOutSchema,
  queryTransactionSchema,
} from '../validators/transaction.validator';
import {
  stockInController,
  stockOutController,
  getTransactionsController,
  exportTransactionsController,
  exportTransactionsPdfController,
  getTransactionByIdController,
} from '../controllers/transaction.controller';

const router = express.Router();

router.get('/', authenticateJwt, validateRequest(queryTransactionSchema), getTransactionsController);
router.get('/export', authenticateJwt, exportTransactionsController);
router.get('/export/pdf', authenticateJwt, exportTransactionsPdfController);
router.get('/:id', authenticateJwt, validateRequest(uuidParamSchema), getTransactionByIdController);
router.post(
  '/in',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN, UserRole.USER),
  validateRequest(stockInSchema),
  stockInController
);
router.post(
  '/out',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN, UserRole.USER),
  validateRequest(stockOutSchema),
  stockOutController
);

export default router;
