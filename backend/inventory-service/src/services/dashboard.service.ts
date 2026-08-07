import { prisma } from '@inventory/shared';
import { computeProductStatus, formatProductResponse } from './product.service';

/**
 * Get KPI Summary Card statistics
 */
export const getDashboardSummaryService = async () => {
  const [totalProducts, totalCategories, totalSuppliers, activeProducts] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.category.count(),
    prisma.supplier.count(),
    prisma.product.findMany({
      where: { deletedAt: null },
      select: {
        quantity: true,
        lowStockThreshold: true,
        unitPrice: true,
      },
    }),
  ]);

  let totalInventoryValue = 0;
  let lowStockProducts = 0;
  let outOfStockProducts = 0;

  activeProducts.forEach((p) => {
    const value = p.quantity * Number(p.unitPrice);
    totalInventoryValue += value;

    const status = computeProductStatus(p.quantity, p.lowStockThreshold);
    if (status === 'LOW_STOCK') {
      lowStockProducts += 1;
    } else if (status === 'OUT_OF_STOCK') {
      outOfStockProducts += 1;
    }
  });

  return {
    totalProducts,
    totalCategories,
    totalSuppliers,
    totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
    lowStockProducts,
    outOfStockProducts,
  };
};

/**
 * Get Stock Status distribution summary
 */
export const getStockStatusSummaryService = async () => {
  const activeProducts = await prisma.product.findMany({
    where: { deletedAt: null },
    select: {
      quantity: true,
      lowStockThreshold: true,
    },
  });

  let inStock = 0;
  let lowStock = 0;
  let outOfStock = 0;

  activeProducts.forEach((p) => {
    const status = computeProductStatus(p.quantity, p.lowStockThreshold);
    if (status === 'IN_STOCK') inStock += 1;
    else if (status === 'LOW_STOCK') lowStock += 1;
    else if (status === 'OUT_OF_STOCK') outOfStock += 1;
  });

  return {
    inStock,
    lowStock,
    outOfStock,
  };
};

/**
 * Get Latest 10 Recent Inventory Transactions
 */
export const getRecentTransactionsService = async () => {
  const transactions = await prisma.inventoryTransaction.findMany({
    take: 10,
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

  return transactions.map((t) => ({
    id: t.id,
    type: t.type,
    quantity: t.quantity,
    remarks: t.remarks,
    createdAt: t.createdAt,
    product: formatProductResponse(t.product),
  }));
};

/**
 * Get Top 5 products by highest total inventory value (quantity * unitPrice)
 */
export const getTopProductsService = async () => {
  const activeProducts = await prisma.product.findMany({
    where: { deletedAt: null },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
  });

  const productsWithValue = activeProducts.map((p) => {
    const inventoryValue = Math.round(p.quantity * Number(p.unitPrice) * 100) / 100;
    return {
      product: formatProductResponse(p),
      quantity: p.quantity,
      inventoryValue,
    };
  });

  productsWithValue.sort((a, b) => b.inventoryValue - a.inventoryValue);

  return productsWithValue.slice(0, 5);
};

/**
 * Get Total Inventory Value grouped by Category
 */
export const getCategoryInventoryValueService = async () => {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        where: { deletedAt: null },
        select: {
          quantity: true,
          unitPrice: true,
        },
      },
    },
  });

  return categories.map((c) => {
    const inventoryValue = c.products.reduce((acc, p) => {
      return acc + p.quantity * Number(p.unitPrice);
    }, 0);

    return {
      categoryId: c.id,
      category: c.name,
      inventoryValue: Math.round(inventoryValue * 100) / 100,
      productCount: c.products.length,
    };
  });
};

/**
 * Get List of Low Stock and Out of Stock products
 */
export const getLowStockProductsService = async () => {
  const activeProducts = await prisma.product.findMany({
    where: { deletedAt: null },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
    orderBy: {
      quantity: 'asc',
    },
  });

  const lowStockList = activeProducts
    .map((p) => formatProductResponse(p))
    .filter((p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK');

  return lowStockList;
};
