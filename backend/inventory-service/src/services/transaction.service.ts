import { prisma, ApiError, generateCsv, CsvColumn, generatePdfReport, PdfColumn } from '@inventory/shared';
import { Prisma } from '@prisma/client';
import { formatProductResponse } from './product.service';

export interface StockMovementInput {
  productId: string;
  quantity: number;
  remarks?: string;
}

export interface QueryTransactionInput {
  page: number;
  limit: number;
  search?: string;
  type?: 'IN' | 'OUT';
  productId?: string;
  categoryId?: string;
  supplierId?: string;
  sort: 'createdAt';
  order: 'asc' | 'desc';
}

/**
 * Execute Stock IN movement (Atomic quantity increment + Immutable audit log)
 */
export const stockInService = async (input: StockMovementInput) => {
  return prisma.$transaction(async (tx) => {
    // 1. Verify active product exists
    const product = await tx.product.findFirst({
      where: { id: input.productId, deletedAt: null },
    });

    if (!product) {
      throw ApiError.notFound(`Product with ID "${input.productId}" not found`);
    }

    // 2. Atomically increment product quantity
    const updatedProduct = await tx.product.update({
      where: { id: input.productId },
      data: {
        quantity: {
          increment: input.quantity,
        },
      },
      include: {
        category: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    // 3. Create immutable audit transaction record
    const transaction = await tx.inventoryTransaction.create({
      data: {
        productId: input.productId,
        type: 'IN',
        quantity: input.quantity,
        remarks: input.remarks?.trim() || null,
      },
    });

    return {
      transaction: {
        id: transaction.id,
        type: transaction.type,
        quantity: transaction.quantity,
        remarks: transaction.remarks,
        createdAt: transaction.createdAt,
      },
      product: formatProductResponse(updatedProduct),
    };
  });
};

/**
 * Execute Stock OUT movement (Stock availability check + Atomic quantity decrement + Immutable audit log)
 */
export const stockOutService = async (input: StockMovementInput) => {
  return prisma.$transaction(async (tx) => {
    // 1. Verify active product exists
    const product = await tx.product.findFirst({
      where: { id: input.productId, deletedAt: null },
    });

    if (!product) {
      throw ApiError.notFound(`Product with ID "${input.productId}" not found`);
    }

    // 2. Reject if requested quantity exceeds available stock (Prevent negative inventory)
    if (product.quantity < input.quantity) {
      throw ApiError.badRequest(
        `Insufficient stock for "${product.productName}". Available: ${product.quantity}, Requested: ${input.quantity}`
      );
    }

    // 3. Atomically decrement product quantity
    const updatedProduct = await tx.product.update({
      where: { id: input.productId },
      data: {
        quantity: {
          decrement: input.quantity,
        },
      },
      include: {
        category: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    // 4. Create immutable audit transaction record
    const transaction = await tx.inventoryTransaction.create({
      data: {
        productId: input.productId,
        type: 'OUT',
        quantity: input.quantity,
        remarks: input.remarks?.trim() || null,
      },
    });

    return {
      transaction: {
        id: transaction.id,
        type: transaction.type,
        quantity: transaction.quantity,
        remarks: transaction.remarks,
        createdAt: transaction.createdAt,
      },
      product: formatProductResponse(updatedProduct),
    };
  });
};

/**
 * Get Paginated Inventory Transaction History with filters
 */
export const getTransactionsService = async (query: QueryTransactionInput) => {
  const { page, limit, search, type, productId, categoryId, supplierId, sort, order } = query;
  const skip = (page - 1) * limit;

  const whereCondition: Prisma.InventoryTransactionWhereInput = {};

  if (type) {
    whereCondition.type = type;
  }

  if (productId) {
    whereCondition.productId = productId;
  }

  if (categoryId || supplierId || search) {
    whereCondition.product = {
      ...(categoryId && { categoryId }),
      ...(supplierId && { supplierId }),
      ...(search && {
        OR: [
          { productName: { contains: search.trim(), mode: 'insensitive' } },
          { sku: { contains: search.trim(), mode: 'insensitive' } },
        ],
      }),
    };
  }

  const [transactions, total] = await Promise.all([
    prisma.inventoryTransaction.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: {
        [sort]: order,
      },
      include: {
        product: {
          include: {
            category: { select: { id: true, name: true } },
            supplier: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.inventoryTransaction.count({ where: whereCondition }),
  ]);

  const formattedTransactions = transactions.map((t) => ({
    id: t.id,
    type: t.type,
    quantity: t.quantity,
    remarks: t.remarks,
    createdAt: t.createdAt,
    product: formatProductResponse(t.product),
  }));

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    transactions: formattedTransactions,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

/**
 * Export Transactions as CSV string respecting filters (ignoring pagination limits)
 */
export const exportTransactionsService = async (params: {
  search?: string;
  type?: 'IN' | 'OUT';
  productId?: string;
  categoryId?: string;
  supplierId?: string;
}) => {
  const { search, type, productId, categoryId, supplierId } = params;

  const whereCondition: Prisma.InventoryTransactionWhereInput = {};

  if (type) {
    whereCondition.type = type;
  }

  if (productId) {
    whereCondition.productId = productId;
  }

  if (categoryId || supplierId || search) {
    whereCondition.product = {
      ...(categoryId && { categoryId }),
      ...(supplierId && { supplierId }),
      ...(search && {
        OR: [
          { productName: { contains: search.trim(), mode: 'insensitive' } },
          { sku: { contains: search.trim(), mode: 'insensitive' } },
        ],
      }),
    };
  }

  const transactions = await prisma.inventoryTransaction.findMany({
    where: whereCondition,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      product: {
        include: {
          category: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
        },
      },
    },
  });

  const columns: CsvColumn<typeof transactions[0]>[] = [
    { header: 'Product', accessor: (t) => t.product?.productName || '' },
    { header: 'SKU', accessor: (t) => t.product?.sku || '' },
    { header: 'Movement', accessor: (t) => t.type },
    { header: 'Quantity', accessor: (t) => t.quantity },
    { header: 'Remarks', accessor: (t) => t.remarks || '' },
    { header: 'Created At', accessor: (t) => new Date(t.createdAt).toISOString() },
  ];

  return generateCsv(columns, transactions);
};

/**
 * Export Transactions as PDF report Buffer respecting filters (ignoring pagination limits)
 */
export const exportTransactionsPdfService = async (params: {
  search?: string;
  type?: 'IN' | 'OUT';
  productId?: string;
  categoryId?: string;
  supplierId?: string;
}): Promise<Buffer> => {
  const { search, type, productId, categoryId, supplierId } = params;

  const whereCondition: Prisma.InventoryTransactionWhereInput = {};

  if (type) {
    whereCondition.type = type;
  }

  if (productId) {
    whereCondition.productId = productId;
  }

  if (categoryId || supplierId || search) {
    whereCondition.product = {
      ...(categoryId && { categoryId }),
      ...(supplierId && { supplierId }),
      ...(search && {
        OR: [
          { productName: { contains: search.trim(), mode: 'insensitive' } },
          { sku: { contains: search.trim(), mode: 'insensitive' } },
        ],
      }),
    };
  }

  const transactions = await prisma.inventoryTransaction.findMany({
    where: whereCondition,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      product: {
        include: {
          category: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
        },
      },
    },
  });

  const columns: PdfColumn<typeof transactions[0]>[] = [
    { header: 'Product', accessor: (t) => t.product?.productName || 'N/A', width: 140 },
    { header: 'Movement', accessor: (t) => t.type, width: 70 },
    { header: 'Qty', accessor: (t) => t.quantity, width: 50 },
    { header: 'Reason / Remarks', accessor: (t) => t.remarks || '—', width: 150 },
    { header: 'Created At', accessor: (t) => new Date(t.createdAt).toLocaleDateString() },
  ];

  return generatePdfReport('Stock Transactions Audit Report', columns, transactions);
};

/**
 * Get Single Transaction by ID
 */
export const getTransactionByIdService = async (id: string) => {
  const transaction = await prisma.inventoryTransaction.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          category: { select: { id: true, name: true } },
          supplier: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!transaction) {
    throw ApiError.notFound(`Transaction with ID "${id}" not found`);
  }

  return {
    id: transaction.id,
    type: transaction.type,
    quantity: transaction.quantity,
    remarks: transaction.remarks,
    createdAt: transaction.createdAt,
    product: formatProductResponse(transaction.product),
  };
};
