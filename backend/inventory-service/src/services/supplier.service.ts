import { prisma, ApiError, generateCsv, CsvColumn, generatePdfReport, PdfColumn } from '@inventory/shared';
import { Prisma } from '@prisma/client';

export interface CreateSupplierInput {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateSupplierInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface QuerySupplierInput {
  page: number;
  limit: number;
  search?: string;
  sort: 'name' | 'createdAt';
  order: 'asc' | 'desc';
}

/**
 * Create a new Supplier
 */
export const createSupplierService = async (input: CreateSupplierInput) => {
  const trimmedName = input.name.trim();

  // 1. Case-insensitive duplicate name check
  const existing = await prisma.supplier.findFirst({
    where: {
      name: {
        equals: trimmedName,
        mode: 'insensitive',
      },
    },
  });

  if (existing) {
    throw ApiError.conflict(`A supplier with the name "${trimmedName}" already exists`);
  }

  // 2. Create supplier
  return prisma.supplier.create({
    data: {
      name: trimmedName,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      address: input.address?.trim() || null,
    },
  });
};

/**
 * Get paginated Supplier list with search and sorting
 */
export const getSuppliersService = async (query: QuerySupplierInput) => {
  const { page, limit, search, sort, order } = query;
  const skip = (page - 1) * limit;

  const whereCondition: Prisma.SupplierWhereInput = search
    ? {
        OR: [
          { name: { contains: search.trim(), mode: 'insensitive' } },
          { email: { contains: search.trim(), mode: 'insensitive' } },
        ],
      }
    : {};

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
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
    prisma.supplier.count({ where: whereCondition }),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    suppliers,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

/**
 * Export Suppliers as CSV string respecting search filter (ignoring pagination limits)
 */
export const exportSuppliersService = async (search?: string) => {
  const whereCondition: Prisma.SupplierWhereInput = search
    ? {
        OR: [
          { name: { contains: search.trim(), mode: 'insensitive' } },
          { email: { contains: search.trim(), mode: 'insensitive' } },
        ],
      }
    : {};

  const suppliers = await prisma.supplier.findMany({
    where: whereCondition,
    orderBy: {
      name: 'asc',
    },
  });

  const columns: CsvColumn<typeof suppliers[0]>[] = [
    { header: 'Name', accessor: (s) => s.name },
    { header: 'Email', accessor: (s) => s.email || '' },
    { header: 'Phone', accessor: (s) => s.phone || '' },
    { header: 'Created At', accessor: (s) => new Date(s.createdAt).toISOString() },
  ];

  return generateCsv(columns, suppliers);
};

/**
 * Export Suppliers as PDF report Buffer respecting search filter (ignoring pagination limits)
 */
export const exportSuppliersPdfService = async (search?: string): Promise<Buffer> => {
  const whereCondition: Prisma.SupplierWhereInput = search
    ? {
        OR: [
          { name: { contains: search.trim(), mode: 'insensitive' } },
          { email: { contains: search.trim(), mode: 'insensitive' } },
        ],
      }
    : {};

  const suppliers = await prisma.supplier.findMany({
    where: whereCondition,
    orderBy: {
      name: 'asc',
    },
  });

  const columns: PdfColumn<typeof suppliers[0]>[] = [
    { header: 'Name', accessor: (s) => s.name, width: 200 },
    { header: 'Email', accessor: (s) => s.email || 'N/A', width: 200 },
    { header: 'Phone', accessor: (s) => s.phone || 'N/A' },
  ];

  return generatePdfReport('Suppliers Contact & Vendor Report', columns, suppliers);
};

/**
 * Get Supplier by ID
 */
export const getSupplierByIdService = async (id: string) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: { where: { deletedAt: null } } },
      },
    },
  });

  if (!supplier) {
    throw ApiError.notFound(`Supplier with ID "${id}" not found`);
  }

  return supplier;
};

/**
 * Update Supplier by ID (ignoring self record for duplicate check)
 */
export const updateSupplierService = async (id: string, input: UpdateSupplierInput) => {
  // 1. Verify existence
  await getSupplierByIdService(id);

  // 2. Duplicate name check if name is being updated
  if (input.name) {
    const trimmedName = input.name.trim();
    const duplicate = await prisma.supplier.findFirst({
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
      throw ApiError.conflict(`A supplier with the name "${trimmedName}" already exists`);
    }
  }

  // 3. Perform update
  return prisma.supplier.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name.trim() }),
      ...(input.email !== undefined && { email: input.email.trim() || null }),
      ...(input.phone !== undefined && { phone: input.phone.trim() || null }),
      ...(input.address !== undefined && { address: input.address.trim() || null }),
    },
  });
};

/**
 * Delete Supplier (prevented if linked to active products)
 */
export const deleteSupplierService = async (id: string) => {
  // 1. Verify existence
  await getSupplierByIdService(id);

  // 2. Check if referenced by active products
  const linkedProductCount = await prisma.product.count({
    where: {
      supplierId: id,
      deletedAt: null,
    },
  });

  if (linkedProductCount > 0) {
    throw ApiError.badRequest(
      `Cannot delete supplier. It is referenced by ${linkedProductCount} active product(s)`
    );
  }

  // 3. Perform delete
  return prisma.supplier.delete({
    where: { id },
  });
};
