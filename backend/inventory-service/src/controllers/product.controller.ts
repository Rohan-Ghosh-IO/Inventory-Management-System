import { Request, Response, NextFunction } from 'express';

import { sendResponse, HTTP_STATUS } from '@inventory/shared';

import {
  createProductService,
  getProductsService,
  exportProductsService,
  exportProductsPdfService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  deleteProductImageService,
  generateProductQrCodeService,
  QueryProductInput,
  ProductStatus,
} from '../services/product.service';

const parseProductPayload = (body: any) => {
  const parsed = { ...body };
  if (parsed.quantity !== undefined && parsed.quantity !== '') parsed.quantity = Number(parsed.quantity);
  if (parsed.lowStockThreshold !== undefined && parsed.lowStockThreshold !== '') parsed.lowStockThreshold = Number(parsed.lowStockThreshold);
  if (parsed.unitPrice !== undefined && parsed.unitPrice !== '') parsed.unitPrice = Number(parsed.unitPrice);
  if (parsed.removeImage !== undefined) parsed.removeImage = parsed.removeImage === 'true' || parsed.removeImage === true;
  return parsed;
};

export const getProductQrCodeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const qrBuffer = await generateProductQrCodeService(req.params.id);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    res.status(200).send(qrBuffer);
    return;
  } catch (error: any) {
    next(error);
  }
};

export const createProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = parseProductPayload(req.body);
    const fileBuffer = req.file?.buffer;
    const result = await createProductService(payload, fileBuffer);

    return sendResponse(res, HTTP_STATUS.CREATED, 'Product created successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const getProductsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = req.query as unknown as QueryProductInput;
    const { products, meta } = await getProductsService({
      page: query.page,
      limit: query.limit,
      search: query.search,
      categoryId: query.categoryId,
      supplierId: query.supplierId,
      status: query.status,
      sort: query.sort,
      order: query.order,
    });

    return sendResponse(res, HTTP_STATUS.OK, 'Products fetched successfully', products, meta);
  } catch (error: any) {
    next(error);
  }
};

export const exportProductsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;
    const supplierId = req.query.supplierId as string | undefined;
    const status = req.query.status as ProductStatus | undefined;

    const csvContent = await exportProductsService({ search, categoryId, supplierId, status });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');

    res.status(200).send(csvContent);
    return;
  } catch (error: any) {
    next(error);
  }
};

export const exportProductsPdfController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const search = req.query.search as string | undefined;
    const categoryId = req.query.categoryId as string | undefined;
    const supplierId = req.query.supplierId as string | undefined;
    const status = req.query.status as ProductStatus | undefined;

    const pdfBuffer = await exportProductsPdfService({ search, categoryId, supplierId, status });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=products-report.pdf');

    res.status(200).send(pdfBuffer);
    return;
  } catch (error: any) {
    next(error);
  }
};

export const getProductByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await getProductByIdService(req.params.id);

    return sendResponse(res, HTTP_STATUS.OK, 'Product details fetched successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const updateProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = parseProductPayload(req.body);
    const fileBuffer = req.file?.buffer;
    const result = await updateProductService(req.params.id, payload, fileBuffer);

    return sendResponse(res, HTTP_STATUS.OK, 'Product updated successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const deleteProductImageController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await deleteProductImageService(req.params.id);

    return sendResponse(res, HTTP_STATUS.OK, 'Product image deleted successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const deleteProductController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deleteProductService(req.params.id);

    return sendResponse(res, HTTP_STATUS.OK, 'Product soft deleted successfully');
  } catch (error: any) {
    next(error);
  }
};
