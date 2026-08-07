import { Request, Response, NextFunction } from 'express';

import { sendResponse, HTTP_STATUS } from '@inventory/shared';

import {
  stockInService,
  stockOutService,
  getTransactionsService,
  exportTransactionsService,
  exportTransactionsPdfService,
  getTransactionByIdService,
  QueryTransactionInput,
} from '../services/transaction.service';

export const stockInController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await stockInService(req.body);

    return sendResponse(res, HTTP_STATUS.OK, 'Stock added successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const stockOutController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await stockOutService(req.body);

    return sendResponse(res, HTTP_STATUS.OK, 'Stock issued successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const getTransactionsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as QueryTransactionInput;
    const { transactions, meta } = await getTransactionsService({
      page: query.page,
      limit: query.limit,
      search: query.search,
      type: query.type,
      productId: query.productId,
      categoryId: query.categoryId,
      supplierId: query.supplierId,
      sort: query.sort,
      order: query.order,
    });

    return sendResponse(res, HTTP_STATUS.OK, 'Transactions fetched successfully', transactions, meta);
  } catch (error: any) {
    next(error);
  }
};

export const exportTransactionsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const type = req.query.type as 'IN' | 'OUT' | undefined;
    const productId = req.query.productId as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;
    const supplierId = req.query.supplierId as string | undefined;

    const csvContent = await exportTransactionsService({ search, type, productId, categoryId, supplierId });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');

    res.status(200).send(csvContent);
    return;
  } catch (error: any) {
    next(error);
  }
};

export const exportTransactionsPdfController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const type = req.query.type as 'IN' | 'OUT' | undefined;
    const productId = req.query.productId as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;
    const supplierId = req.query.supplierId as string | undefined;

    const pdfBuffer = await exportTransactionsPdfService({ search, type, productId, categoryId, supplierId });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions-report.pdf');

    res.status(200).send(pdfBuffer);
    return;
  } catch (error: any) {
    next(error);
  }
};

export const getTransactionByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getTransactionByIdService(req.params.id);

    return sendResponse(res, HTTP_STATUS.OK, 'Transaction details fetched successfully', result);
  } catch (error: any) {
    next(error);
  }
};
