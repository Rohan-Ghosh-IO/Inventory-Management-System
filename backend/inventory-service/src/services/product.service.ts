import { prisma, ApiError, generateCsv, CsvColumn, generatePdfReport, PdfColumn } from '@inventory/shared';
import { Prisma } from '@prisma/client';
import QRCode from 'qrcode';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../utils/cloudinary.util';

export type ProductStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface CreateProductInput {
  productName: string;
  sku: string;
  description?: string;
  imageUrl?: string | null;
  quantity: number;
  lowStockThreshold: number;
  unitPrice: number;
  supplierId: string;
  categoryId: string;
}

export interface UpdateProductInput {
  productName?: string;
  sku?: string;
  description?: string;
  imageUrl?: string | null;
  removeImage?: boolean;
  quantity?: number;
  lowStockThreshold?: number;
  unitPrice?: number;
  supplierId?: string;
  categoryId?: string;
}

export interface QueryProductInput {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
  supplierId?: string;
  status?: ProductStatus;
  sort: 'productName' | 'unitPrice' | 'quantity' | 'createdAt';
  order: 'asc' | 'desc';
}

/**
 * Reusable helper to compute dynamic product status
 */
export const computeProductStatus = (quantity: number, lowStockThreshold: number): ProductStatus => {
  if (quantity <= 0) {
    return 'OUT_OF_STOCK';
  }
  if (quantity <= lowStockThreshold) {
    return 'LOW_STOCK';
  }
  return 'IN_STOCK';
};

/**
 * Reusable helper to format standardized product response payload
 */
export const formatProductResponse = (product: Prisma.ProductGetPayload<{
  include: {
    category: { select: { id: true; name: true } };
    supplier: { select: { id: true; name: true } };
  };
}>) => {
  return {
    id: product.id,
    productName: product.productName,
    sku: product.sku,
    description: product.description || null,
    imageUrl: product.imageUrl || null,
    quantity: product.quantity,
    lowStockThreshold: product.lowStockThreshold,
    unitPrice: Number(product.unitPrice),
    status: computeProductStatus(product.quantity, product.lowStockThreshold),
    category: {
      id: product.category.id,
      name: product.category.name,
    },
    supplier: {
      id: product.supplier.id,
      name: product.supplier.name,
    },
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};

/**
 * Create Product (wrapped inside Prisma Transaction for race-condition safety)
 */
export const createProductService = async (input: CreateProductInput, fileBuffer?: Buffer) => {
  const normalizedSku = input.sku.trim().toUpperCase();

  let uploadedImageUrl = input.imageUrl || null;
  if (fileBuffer) {
    uploadedImageUrl = await uploadImageToCloudinary(fileBuffer);
  }

  return prisma.$transaction(async (tx) => {
    // 1. Verify Category exists
    const category = await tx.category.findUnique({
      where: { id: input.categoryId },
    });
    if (!category) {
      throw ApiError.notFound(`Category with ID "${input.categoryId}" not found`);
    }

    // 2. Verify Supplier exists
    const supplier = await tx.supplier.findUnique({
      where: { id: input.supplierId },
    });
    if (!supplier) {
      throw ApiError.notFound(`Supplier with ID "${input.supplierId}" not found`);
    }

    // 3. Check SKU uniqueness (among active products)
    const existingSku = await tx.product.findFirst({
      where: {
        sku: normalizedSku,
        deletedAt: null,
      },
    });
    if (existingSku) {
      throw ApiError.conflict(`Product with SKU "${normalizedSku}" already exists`);
    }

    // 4. Create Product
    const product = await tx.product.create({
      data: {
        productName: input.productName.trim(),
        sku: normalizedSku,
        description: input.description?.trim() || null,
        imageUrl: uploadedImageUrl,
        quantity: input.quantity,
        lowStockThreshold: input.lowStockThreshold,
        unitPrice: input.unitPrice,
        categoryId: input.categoryId,
        supplierId: input.supplierId,
      },
      include: {
        category: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    return formatProductResponse(product);
  });
};

/**
 * Get Paginated Products with Search, Filtering & Dynamic Status calculation
 */
export const getProductsService = async (query: QueryProductInput) => {
  const { page, limit, search, categoryId, supplierId, status, sort, order } = query;

  // Base filter excluding soft-deleted records
  const whereCondition: Prisma.ProductWhereInput = {
    deletedAt: null,
  };

  if (categoryId) {
    whereCondition.categoryId = categoryId;
  }

  if (supplierId) {
    whereCondition.supplierId = supplierId;
  }

  if (search) {
    const trimmedSearch = search.trim();
    whereCondition.OR = [
      { productName: { contains: trimmedSearch, mode: 'insensitive' } },
      { sku: { contains: trimmedSearch, mode: 'insensitive' } },
    ];
  }

  // Fetch all active records matching criteria
  const rawProducts = await prisma.product.findMany({
    where: whereCondition,
    orderBy: {
      [sort]: order,
    },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
  });

  // Compute dynamic status and format
  let formattedProducts = rawProducts.map((p) => formatProductResponse(p));

  // In-memory filter by calculated status if specified
  if (status) {
    formattedProducts = formattedProducts.filter((p) => p.status === status);
  }

  const total = formattedProducts.length;
  const skip = (page - 1) * limit;
  const paginatedProducts = formattedProducts.slice(skip, skip + limit);
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    products: paginatedProducts,
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

/**
 * Export Products as CSV string respecting search, category, supplier, status filters (ignoring pagination)
 */
export const exportProductsService = async (params: {
  search?: string;
  categoryId?: string;
  supplierId?: string;
  status?: ProductStatus;
}) => {
  const { search, categoryId, supplierId, status } = params;

  const whereCondition: Prisma.ProductWhereInput = {
    deletedAt: null,
  };

  if (categoryId) {
    whereCondition.categoryId = categoryId;
  }

  if (supplierId) {
    whereCondition.supplierId = supplierId;
  }

  if (search) {
    const trimmedSearch = search.trim();
    whereCondition.OR = [
      { productName: { contains: trimmedSearch, mode: 'insensitive' } },
      { sku: { contains: trimmedSearch, mode: 'insensitive' } },
    ];
  }

  const rawProducts = await prisma.product.findMany({
    where: whereCondition,
    orderBy: {
      productName: 'asc',
    },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
  });

  let formattedProducts = rawProducts.map((p) => formatProductResponse(p));

  if (status) {
    formattedProducts = formattedProducts.filter((p) => p.status === status);
  }

  const columns: CsvColumn<typeof formattedProducts[0]>[] = [
    { header: 'Product Name', accessor: (p) => p.productName },
    { header: 'SKU', accessor: (p) => p.sku },
    { header: 'Category', accessor: (p) => p.category.name },
    { header: 'Supplier', accessor: (p) => p.supplier.name },
    { header: 'Quantity', accessor: (p) => p.quantity },
    { header: 'Low Stock Threshold', accessor: (p) => p.lowStockThreshold },
    { header: 'Status', accessor: (p) => p.status },
    { header: 'Unit Price', accessor: (p) => p.unitPrice },
    { header: 'Created At', accessor: (p) => new Date(p.createdAt).toISOString() },
  ];

  return generateCsv(columns, formattedProducts);
};

/**
 * Export Products as PDF report Buffer respecting search, category, supplier, status filters (ignoring pagination)
 */
export const exportProductsPdfService = async (params: {
  search?: string;
  categoryId?: string;
  supplierId?: string;
  status?: ProductStatus;
}): Promise<Buffer> => {
  const { search, categoryId, supplierId, status } = params;

  const whereCondition: Prisma.ProductWhereInput = {
    deletedAt: null,
  };

  if (categoryId) {
    whereCondition.categoryId = categoryId;
  }

  if (supplierId) {
    whereCondition.supplierId = supplierId;
  }

  if (search) {
    const trimmedSearch = search.trim();
    whereCondition.OR = [
      { productName: { contains: trimmedSearch, mode: 'insensitive' } },
      { sku: { contains: trimmedSearch, mode: 'insensitive' } },
    ];
  }

  const rawProducts = await prisma.product.findMany({
    where: whereCondition,
    orderBy: {
      productName: 'asc',
    },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
  });

  let formattedProducts = rawProducts.map((p) => formatProductResponse(p));

  if (status) {
    formattedProducts = formattedProducts.filter((p) => p.status === status);
  }

  const columns: PdfColumn<typeof formattedProducts[0]>[] = [
    { header: 'Product Name', accessor: (p) => p.productName, width: 130 },
    { header: 'SKU', accessor: (p) => p.sku, width: 75 },
    { header: 'Category', accessor: (p) => p.category.name, width: 80 },
    { header: 'Supplier', accessor: (p) => p.supplier.name, width: 90 },
    { header: 'Qty', accessor: (p) => p.quantity, width: 35 },
    { header: 'Status', accessor: (p) => p.status, width: 65 },
    { header: 'Price', accessor: (p) => `$${p.unitPrice.toFixed(2)}` },
  ];

  return generatePdfReport('Products Stock Inventory Report', columns, formattedProducts);
};

/**
 * Get Product by ID (excluding soft-deleted)
 */
export const getProductByIdService = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
  });

  if (!product) {
    throw ApiError.notFound(`Product with ID "${id}" not found`);
  }

  return formatProductResponse(product);
};

/**
 * Update Product by ID (wrapped inside Prisma Transaction)
 */
export const updateProductService = async (id: string, input: UpdateProductInput, fileBuffer?: Buffer) => {
  // 1. Check Product existence
  const existingProduct = await prisma.product.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existingProduct) {
    throw ApiError.notFound(`Product with ID "${id}" not found`);
  }

  let finalImageUrl: string | null | undefined = undefined;

  if (fileBuffer) {
    // Delete old Cloudinary image if exists
    if (existingProduct.imageUrl) {
      await deleteImageFromCloudinary(existingProduct.imageUrl);
    }
    finalImageUrl = await uploadImageToCloudinary(fileBuffer);
  } else if (input.removeImage || input.imageUrl === null) {
    if (existingProduct.imageUrl) {
      await deleteImageFromCloudinary(existingProduct.imageUrl);
    }
    finalImageUrl = null;
  } else if (input.imageUrl !== undefined) {
    finalImageUrl = input.imageUrl;
  }

  return prisma.$transaction(async (tx) => {
    // 2. Validate Category if provided
    if (input.categoryId) {
      const category = await tx.category.findUnique({
        where: { id: input.categoryId },
      });
      if (!category) {
        throw ApiError.notFound(`Category with ID "${input.categoryId}" not found`);
      }
    }

    // 3. Validate Supplier if provided
    if (input.supplierId) {
      const supplier = await tx.supplier.findUnique({
        where: { id: input.supplierId },
      });
      if (!supplier) {
        throw ApiError.notFound(`Supplier with ID "${input.supplierId}" not found`);
      }
    }

    // 4. Validate SKU uniqueness ignoring self record
    if (input.sku) {
      const normalizedSku = input.sku.trim().toUpperCase();
      const duplicateSku = await tx.product.findFirst({
        where: {
          sku: normalizedSku,
          deletedAt: null,
          NOT: { id },
        },
      });
      if (duplicateSku) {
        throw ApiError.conflict(`Product with SKU "${normalizedSku}" already exists`);
      }
    }

    // 5. Perform Update
    const updatedProduct = await tx.product.update({
      where: { id },
      data: {
        ...(input.productName && { productName: input.productName.trim() }),
        ...(input.sku && { sku: input.sku.trim().toUpperCase() }),
        ...(input.description !== undefined && { description: input.description.trim() || null }),
        ...(finalImageUrl !== undefined && { imageUrl: finalImageUrl }),
        ...(input.quantity !== undefined && { quantity: input.quantity }),
        ...(input.lowStockThreshold !== undefined && { lowStockThreshold: input.lowStockThreshold }),
        ...(input.unitPrice !== undefined && { unitPrice: input.unitPrice }),
        ...(input.categoryId && { categoryId: input.categoryId }),
        ...(input.supplierId && { supplierId: input.supplierId }),
      },
      include: {
        category: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true } },
      },
    });

    return formatProductResponse(updatedProduct);
  });
};

/**
 * Remove Product Image Service
 */
export const deleteProductImageService = async (id: string) => {
  const existingProduct = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
  });

  if (!existingProduct) {
    throw ApiError.notFound(`Product with ID "${id}" not found`);
  }

  if (existingProduct.imageUrl) {
    await deleteImageFromCloudinary(existingProduct.imageUrl);
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { imageUrl: null },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
  });

  return formatProductResponse(updatedProduct);
};

/**
 * Soft Delete Product (sets deletedAt timestamp)
 */
export const deleteProductService = async (id: string) => {
  const existingProduct = await prisma.product.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existingProduct) {
    throw ApiError.notFound(`Product with ID "${id}" not found`);
  }

  if (existingProduct.imageUrl) {
    await deleteImageFromCloudinary(existingProduct.imageUrl);
  }

  return prisma.product.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      imageUrl: null,
    },
  });
};

/**
 * Generate Product QR Code as PNG Buffer
 */
export const generateProductQrCodeService = async (id: string): Promise<Buffer> => {
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: {
      category: { select: { name: true } },
      supplier: { select: { name: true } },
    },
  });

  if (!product) {
    throw ApiError.notFound(`Product with ID "${id}" not found`);
  }

  const qrPayload = `Product Information
📦 Product Name: ${product.productName}
🔖 SKU: ${product.sku}
🏷️ Category: ${product.category?.name || 'N/A'}
🚚 Supplier: ${product.supplier?.name || 'N/A'}`;

  const buffer = await QRCode.toBuffer(qrPayload, {
    type: 'png',
    margin: 2,
    width: 350,
    color: {
      dark: '#0F172A',
      light: '#FFFFFF',
    },
  });

  return buffer;
};
