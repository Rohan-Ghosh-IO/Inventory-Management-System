import { prisma, ApiError, generateCsv, CsvColumn, generatePdfReport, PdfColumn } from '@inventory/shared';
import { Prisma } from '@prisma/client';

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
}

export interface QueryCategoryInput {
  page: number;
  limit: number;
  search?: string;
  sort: 'name' | 'createdAt';
  order: 'asc' | 'desc';
}

/**
 * Create a new Category
 */
export const createCategoryService = async (input: CreateCategoryInput) => {
  const trimmedName = input.name.trim();

  // 1. Case-insensitive duplicate name check
  const existing = await prisma.category.findFirst({
    where: {
      name: {
        equals: trimmedName,
        mode: 'insensitive',
      },
    },
  });

  if (existing) {
    throw ApiError.conflict(`A category with the name "${trimmedName}" already exists`);
  }

  // 2. Create category
  return prisma.category.create({
    data: {
      name: trimmedName,
      description: input.description?.trim() || null,
    },
  });
};

/**
 * Get paginated Category list with search and sorting
 */
export const getCategoriesService = async (query: QueryCategoryInput) => {
  const { page, limit, search, sort, order } = query;
  const skip = (page - 1) * limit;

  const whereCondition: Prisma.CategoryWhereInput = search
    ? {
        name: {
          contains: search.trim(),
          mode: 'insensitive',
        },
      }
    : {};

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        [sort]: order,
      },
      include: {
        _count: {
          select: { products: { where: { deletedAt: null } } },
        },
      },
    }),
    prisma.category.count({ where: whereCondition }),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    categories,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

/**
 * Export Categories as CSV string respecting search filter (ignoring pagination limits)
 */
export const exportCategoriesService = async (search?: string) => {
  const whereCondition: Prisma.CategoryWhereInput = search
    ? {
        name: {
          contains: search.trim(),
          mode: 'insensitive',
        },
      }
    : {};

  const categories = await prisma.category.findMany({
    where: whereCondition,
    orderBy: {
      name: 'asc',
    },
  });

  const columns: CsvColumn<typeof categories[0]>[] = [
    { header: 'Name', accessor: (c) => c.name },
    { header: 'Created At', accessor: (c) => new Date(c.createdAt).toISOString() },
  ];

  return generateCsv(columns, categories);
};

/**
 * Export Categories as PDF report Buffer respecting search filter (ignoring pagination limits)
 */
export const exportCategoriesPdfService = async (search?: string): Promise<Buffer> => {
  const whereCondition: Prisma.CategoryWhereInput = search
    ? {
        name: {
          contains: search.trim(),
          mode: 'insensitive',
        },
      }
    : {};

  const categories = await prisma.category.findMany({
    where: whereCondition,
    orderBy: {
      name: 'asc',
    },
  });

  const columns: PdfColumn<typeof categories[0]>[] = [
    { header: 'Name', accessor: (c) => c.name, width: 300 },
    { header: 'Created At', accessor: (c) => new Date(c.createdAt).toLocaleDateString() },
  ];

  return generatePdfReport('Categories Inventory Report', columns, categories);
};

/**
 * Get Category by ID
 */
export const getCategoryByIdService = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: { where: { deletedAt: null } } },
      },
    },
  });

  if (!category) {
    throw ApiError.notFound(`Category with ID "${id}" not found`);
  }

  return category;
};

/**
 * Update Category by ID (ignoring self record for duplicate check)
 */
export const updateCategoryService = async (id: string, input: UpdateCategoryInput) => {
  // 1. Verify existence
  await getCategoryByIdService(id);

  // 2. Duplicate name check if name is being updated
  if (input.name) {
    const trimmedName = input.name.trim();
    const duplicate = await prisma.category.findFirst({
      where: {
        name: {
          equals: trimmedName,
          mode: 'insensitive',
        },
        NOT: {
          id,
        },
      },
    });

    if (duplicate) {
      throw ApiError.conflict(`A category with the name "${trimmedName}" already exists`);
    }
  }

  // 3. Perform update
  return prisma.category.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name.trim() }),
      ...(input.description !== undefined && { description: input.description.trim() || null }),
    },
  });
};

/**
 * Delete Category (prevented if linked to active products)
 */
export const deleteCategoryService = async (id: string) => {
  // 1. Verify existence
  await getCategoryByIdService(id);

  // 2. Check if referenced by active products
  const linkedProductCount = await prisma.product.count({
    where: {
      categoryId: id,
      deletedAt: null,
    },
  });

  if (linkedProductCount > 0) {
    throw ApiError.badRequest(
      `Cannot delete category. It is referenced by ${linkedProductCount} active product(s)`
    );
  }

  // 3. Perform delete
  return prisma.category.delete({
    where: { id },
  });
};
