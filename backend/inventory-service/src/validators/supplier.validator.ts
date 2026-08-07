import { z } from 'zod';

export const createSupplierSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Supplier name must be at least 2 characters long')
      .max(100, 'Supplier name cannot exceed 100 characters'),
    email: z.string().email('Invalid email address').trim().optional().or(z.literal('')),
    phone: z.string().trim().max(30, 'Phone number cannot exceed 30 characters').optional().or(z.literal('')),
    address: z.string().trim().max(300, 'Address cannot exceed 300 characters').optional().or(z.literal('')),
  }),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>['body'];

export const updateSupplierSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid supplier ID format'),
  }),
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Supplier name must be at least 2 characters long')
      .max(100, 'Supplier name cannot exceed 100 characters')
      .optional(),
    email: z.string().email('Invalid email address').trim().optional().or(z.literal('')),
    phone: z.string().trim().max(30, 'Phone number cannot exceed 30 characters').optional().or(z.literal('')),
    address: z.string().trim().max(300, 'Address cannot exceed 300 characters').optional().or(z.literal('')),
  }),
});

export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>['body'];

export const querySupplierSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    sort: z.enum(['name', 'createdAt']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

export type QuerySupplierInput = z.infer<typeof querySupplierSchema>['query'];
