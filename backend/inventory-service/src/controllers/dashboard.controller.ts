import { Request, Response, NextFunction } from 'express';

import { sendResponse, HTTP_STATUS } from '@inventory/shared';

import {
  getDashboardSummaryService,
  getStockStatusSummaryService,
  getRecentTransactionsService,
  getTopProductsService,
  getCategoryInventoryValueService,
  getLowStockProductsService,
} from '../services/dashboard.service';

export const getSummaryController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getDashboardSummaryService();

    return sendResponse(res, HTTP_STATUS.OK, 'Dashboard summary fetched successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const getStockStatusController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getStockStatusSummaryService();

    return sendResponse(res, HTTP_STATUS.OK, 'Stock status summary fetched successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const getRecentTransactionsController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getRecentTransactionsService();

    return sendResponse(res, HTTP_STATUS.OK, 'Recent transactions fetched successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const getTopProductsController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getTopProductsService();

    return sendResponse(res, HTTP_STATUS.OK, 'Top products fetched successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const getCategoryValueController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getCategoryInventoryValueService();

    return sendResponse(res, HTTP_STATUS.OK, 'Category inventory value fetched successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const getLowStockController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getLowStockProductsService();

    return sendResponse(res, HTTP_STATUS.OK, 'Low stock products fetched successfully', result);
  } catch (error: any) {
    next(error);
  }
};
