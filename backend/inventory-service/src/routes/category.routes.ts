import express from 'express';

import {
  validateRequest,
  authenticateJwt,
  authorizeRoles,
  UserRole,
  uuidParamSchema,
} from '@inventory/shared';

import {
  createCategorySchema,
  updateCategorySchema,
  queryCategorySchema,
} from '../validators/category.validator';
import {
  createCategoryController,
  getCategoriesController,
  exportCategoriesController,
  exportCategoriesPdfController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from '../controllers/category.controller';

const router = express.Router();

router.get('/', authenticateJwt, validateRequest(queryCategorySchema), getCategoriesController);
router.get('/export', authenticateJwt, exportCategoriesController);
router.get('/export/pdf', authenticateJwt, exportCategoriesPdfController);
router.get('/:id', authenticateJwt, validateRequest(uuidParamSchema), getCategoryByIdController);
router.post(
  '/',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(createCategorySchema),
  createCategoryController
);
router.put(
  '/:id',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(updateCategorySchema),
  updateCategoryController
);
router.delete(
  '/:id',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(uuidParamSchema),
  deleteCategoryController
);

export default router;
