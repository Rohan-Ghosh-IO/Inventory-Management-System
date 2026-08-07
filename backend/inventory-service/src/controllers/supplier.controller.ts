import { Request, Response, NextFunction } from 'express';

import { sendResponse, HTTP_STATUS } from '@inventory/shared';

import {
  createSupplierService,
  getSuppliersService,
  exportSuppliersService,
  exportSuppliersPdfService,
  getSupplierByIdService,
  updateSupplierService,
  deleteSupplierService,
  QuerySupplierInput,
} from '../services/supplier.service';

export const createSupplierController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await createSupplierService(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, 'Supplier created successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const getSuppliersController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as QuerySupplierInput;
    const { suppliers, meta } = await getSuppliersService({
      page: query.page,
      limit: query.limit,
      search: query.search,
      sort: query.sort,
      order: query.order,
    });

    return sendResponse(res, HTTP_STATUS.OK, 'Suppliers fetched successfully', suppliers, meta);
  } catch (error: any) {
    next(error);
  }
};

export const exportSuppliersController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const csvContent = await exportSuppliersService(search);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=suppliers.csv');

    res.status(200).send(csvContent);
    return;
  } catch (error: any) {
    next(error);
  }
};

export const exportSuppliersPdfController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const pdfBuffer = await exportSuppliersPdfService(search);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=suppliers-report.pdf');

    res.status(200).send(pdfBuffer);
    return;
  } catch (error: any) {
    next(error);
  }
};

export const getSupplierByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getSupplierByIdService(req.params.id);

    return sendResponse(res, HTTP_STATUS.OK, 'Supplier details fetched successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const updateSupplierController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await updateSupplierService(req.params.id, req.body);

    return sendResponse(res, HTTP_STATUS.OK, 'Supplier updated successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const deleteSupplierController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteSupplierService(req.params.id);

    return sendResponse(res, HTTP_STATUS.OK, 'Supplier deleted successfully');
  } catch (error: any) {
    next(error);
  }
};
