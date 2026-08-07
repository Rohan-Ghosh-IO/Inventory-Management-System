import express from 'express';

import {
  validateRequest,
  authenticateJwt,
  authorizeRoles,
  UserRole,
  uuidParamSchema,
} from '@inventory/shared';

import {
  createSupplierSchema,
  updateSupplierSchema,
  querySupplierSchema,
} from '../validators/supplier.validator';
import {
  createSupplierController,
  getSuppliersController,
  exportSuppliersController,
  exportSuppliersPdfController,
  getSupplierByIdController,
  updateSupplierController,
  deleteSupplierController,
} from '../controllers/supplier.controller';

const router = express.Router();

router.get('/', authenticateJwt, validateRequest(querySupplierSchema), getSuppliersController);
router.get('/export', authenticateJwt, exportSuppliersController);
router.get('/export/pdf', authenticateJwt, exportSuppliersPdfController);
router.get('/:id', authenticateJwt, validateRequest(uuidParamSchema), getSupplierByIdController);
router.post(
  '/',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(createSupplierSchema),
  createSupplierController
);
router.put(
  '/:id',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(updateSupplierSchema),
  updateSupplierController
);
router.delete(
  '/:id',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(uuidParamSchema),
  deleteSupplierController
);

export default router;
