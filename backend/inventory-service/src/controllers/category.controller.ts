import { Request, Response, NextFunction } from 'express';

import { sendResponse, HTTP_STATUS } from '@inventory/shared';

import {
  createCategoryService,
  getCategoriesService,
  exportCategoriesService,
  exportCategoriesPdfService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
  QueryCategoryInput,
} from '../services/category.service';

export const createCategoryController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await createCategoryService(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, 'Category created successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const getCategoriesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as QueryCategoryInput;
    const { categories, meta } = await getCategoriesService({
      page: query.page,
      limit: query.limit,
      search: query.search,
      sort: query.sort,
      order: query.order,
    });

    return sendResponse(res, HTTP_STATUS.OK, 'Categories fetched successfully', categories, meta);
  } catch (error: any) {
    next(error);
  }
};

export const exportCategoriesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const csvContent = await exportCategoriesService(search);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=categories.csv');

    res.status(200).send(csvContent);
    return;
  } catch (error: any) {
    next(error);
  }
};

export const exportCategoriesPdfController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const pdfBuffer = await exportCategoriesPdfService(search);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=categories-report.pdf');

    res.status(200).send(pdfBuffer);
    return;
  } catch (error: any) {
    next(error);
  }
};

export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getCategoryByIdService(req.params.id);

    return sendResponse(res, HTTP_STATUS.OK, 'Category details fetched successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const updateCategoryController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await updateCategoryService(req.params.id, req.body);

    return sendResponse(res, HTTP_STATUS.OK, 'Category updated successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteCategoryService(req.params.id);

    return sendResponse(res, HTTP_STATUS.OK, 'Category deleted successfully');
  } catch (error: any) {
    next(error);
  }
};
