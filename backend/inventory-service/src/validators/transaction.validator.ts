import { z } from 'zod';

export const stockInSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID format'),
    quantity: z.number().int().positive('Quantity must be a positive integer greater than zero'),
    remarks: z.string().trim().max(500, 'Remarks cannot exceed 500 characters').optional(),
  }),
});

export type StockInInput = z.infer<typeof stockInSchema>['body'];

export const stockOutSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID format'),
    quantity: z.number().int().positive('Quantity must be a positive integer greater than zero'),
    remarks: z.string().trim().max(500, 'Remarks cannot exceed 500 characters').optional(),
  }),
});

export type StockOutInput = z.infer<typeof stockOutSchema>['body'];

export const queryTransactionSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    type: z.enum(['IN', 'OUT']).optional(),
    productId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    supplierId: z.string().uuid().optional(),
    sort: z.enum(['createdAt']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

export type QueryTransactionInput = z.infer<typeof queryTransactionSchema>['query'];
