import { z } from 'zod';

export const uuidParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID parameter'),
  }),
});

export const paginationQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
  }),
});
