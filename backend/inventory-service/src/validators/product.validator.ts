import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    productName: z
      .string()
      .trim()
      .min(2, 'Product name must be at least 2 characters long')
      .max(150, 'Product name cannot exceed 150 characters'),
    sku: z
      .string()
      .trim()
      .min(2, 'SKU must be at least 2 characters long')
      .max(50, 'SKU cannot exceed 50 characters')
      .transform((val) => val.toUpperCase()),
    description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').optional(),
    imageUrl: z.string().nullable().optional(),
    quantity: z.preprocess(
      (val) => (typeof val === 'string' && val !== '' ? Number(val) : val),
      z.number().int().min(0, 'Quantity must be a non-negative integer')
    ),
    lowStockThreshold: z.preprocess(
      (val) => (typeof val === 'string' && val !== '' ? Number(val) : val),
      z.number().int().min(0, 'Low stock threshold must be a non-negative integer')
    ),
    unitPrice: z.preprocess(
      (val) => (typeof val === 'string' && val !== '' ? Number(val) : val),
      z.number().positive('Unit price must be greater than zero')
    ),
    supplierId: z.string().uuid('Invalid supplier ID format'),
    categoryId: z.string().uuid('Invalid category ID format'),
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID format'),
  }),
  body: z.object({
    productName: z
      .string()
      .trim()
      .min(2, 'Product name must be at least 2 characters long')
      .max(150, 'Product name cannot exceed 150 characters')
      .optional(),
    sku: z
      .string()
      .trim()
      .min(2, 'SKU must be at least 2 characters long')
      .max(50, 'SKU cannot exceed 50 characters')
      .transform((val) => val.toUpperCase())
      .optional(),
    description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').optional(),
    imageUrl: z.string().nullable().optional(),
    removeImage: z.union([z.boolean(), z.string().transform((val) => val === 'true')]).optional(),
    quantity: z.preprocess(
      (val) => (typeof val === 'string' && val !== '' ? Number(val) : val),
      z.number().int().min(0, 'Quantity must be a non-negative integer').optional()
    ),
    lowStockThreshold: z.preprocess(
      (val) => (typeof val === 'string' && val !== '' ? Number(val) : val),
      z.number().int().min(0, 'Low stock threshold must be a non-negative integer').optional()
    ),
    unitPrice: z.preprocess(
      (val) => (typeof val === 'string' && val !== '' ? Number(val) : val),
      z.number().positive('Unit price must be greater than zero').optional()
    ),
    supplierId: z.string().uuid('Invalid supplier ID format').optional(),
    categoryId: z.string().uuid('Invalid category ID format').optional(),
  }),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];

export const queryProductSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    categoryId: z.string().uuid().optional(),
    supplierId: z.string().uuid().optional(),
    status: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']).optional(),
    sort: z.enum(['productName', 'unitPrice', 'quantity', 'createdAt']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

export type QueryProductInput = z.infer<typeof queryProductSchema>['query'];
