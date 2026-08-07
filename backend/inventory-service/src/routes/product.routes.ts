import express from 'express';

import {
  validateRequest,
  authenticateJwt,
  authorizeRoles,
  UserRole,
  uuidParamSchema,
} from '@inventory/shared';

import {
  createProductSchema,
  updateProductSchema,
  queryProductSchema,
} from '../validators/product.validator';
import {
  uploadProductImageMiddleware
} from '../middlewares/upload.middleware';
import {
  createProductController,
  getProductsController,
  exportProductsController,
  exportProductsPdfController,
  getProductByIdController,
  getProductQrCodeController,
  updateProductController,
  deleteProductImageController,
  deleteProductController,
} from '../controllers/product.controller';

const router = express.Router();

router.get('/', authenticateJwt, validateRequest(queryProductSchema), getProductsController);
router.get('/export', authenticateJwt, exportProductsController);
router.get('/export/pdf', authenticateJwt, exportProductsPdfController);
router.get('/:id/qrcode', authenticateJwt, validateRequest(uuidParamSchema), getProductQrCodeController);
router.get('/:id', authenticateJwt, validateRequest(uuidParamSchema), getProductByIdController);
router.post(
  '/',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  uploadProductImageMiddleware,
  validateRequest(createProductSchema),
  createProductController
);
router.put(
  '/:id',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  uploadProductImageMiddleware,
  validateRequest(updateProductSchema),
  updateProductController
);
router.delete(
  '/:id/image',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(uuidParamSchema),
  deleteProductImageController
);
router.delete(
  '/:id',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(uuidParamSchema),
  deleteProductController
);

export default router;
