import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Category name must be at least 2 characters long')
      .max(100, 'Category name cannot exceed 100 characters'),
    description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional(),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>['body'];

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID format'),
  }),
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Category name must be at least 2 characters long')
      .max(100, 'Category name cannot exceed 100 characters')
      .optional(),
    description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional(),
  }),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>['body'];

export const queryCategorySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    sort: z.enum(['name', 'createdAt']).optional().default('createdAt'),
    order: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

export type QueryCategoryInput = z.infer<typeof queryCategorySchema>['query'];
