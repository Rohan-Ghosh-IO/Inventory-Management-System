import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Microservice API Specification',
      version: '1.0.0',
      description: 'Production-grade Inventory Management API handling Products, Image Uploads, QR Codes, Categories, Suppliers, Stock Transactions, Reports, and Analytics Dashboard',
    },
    servers: [
      {
        url: 'http://localhost:5002/api/v1',
        description: 'Development Inventory Microservice Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide JWT token as "Bearer <token>"',
        },
      },
    },
    paths: {
      // ==================== PRODUCTS ====================
      '/products': {
        get: {
          summary: 'Get paginated list of active products with search and filtering',
          tags: ['Products'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
            { in: 'query', name: 'search', schema: { type: 'string' } },
            { in: 'query', name: 'categoryId', schema: { type: 'string' } },
            { in: 'query', name: 'supplierId', schema: { type: 'string' } },
            { in: 'query', name: 'status', schema: { type: 'string', enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'] } },
            { in: 'query', name: 'sort', schema: { type: 'string', enum: ['productName', 'unitPrice', 'quantity', 'createdAt'], default: 'createdAt' } },
            { in: 'query', name: 'order', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
          ],
          responses: {
            200: { description: 'Products fetched successfully' },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          summary: 'Create a new product (supports Cloudinary image upload via multipart/form-data)',
          tags: ['Products'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['productName', 'sku', 'quantity', 'lowStockThreshold', 'unitPrice', 'supplierId', 'categoryId'],
                  properties: {
                    productName: { type: 'string', example: 'Ergonomic Mechanical Keyboard' },
                    sku: { type: 'string', example: 'KB-8001' },
                    description: { type: 'string', example: 'RGB Mechanical Gaming Keyboard' },
                    quantity: { type: 'integer', example: 50 },
                    lowStockThreshold: { type: 'integer', example: 10 },
                    unitPrice: { type: 'number', example: 129.99 },
                    supplierId: { type: 'string', example: 'c0b89326-7c6d-4d7a-8f12-000000000001' },
                    categoryId: { type: 'string', example: 'b0b89326-7c6d-4d7a-8f12-000000000001' },
                    image: { type: 'string', format: 'binary', description: 'Product Image (JPG, JPEG, PNG, WEBP, max 5MB)' },
                  },
                },
              },
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productName', 'sku', 'quantity', 'lowStockThreshold', 'unitPrice', 'supplierId', 'categoryId'],
                  properties: {
                    productName: { type: 'string', example: 'Ergonomic Mechanical Keyboard' },
                    sku: { type: 'string', example: 'KB-8001' },
                    description: { type: 'string', example: 'RGB Mechanical Gaming Keyboard' },
                    quantity: { type: 'integer', example: 50 },
                    lowStockThreshold: { type: 'integer', example: 10 },
                    unitPrice: { type: 'number', example: 129.99 },
                    supplierId: { type: 'string', example: 'c0b89326-7c6d-4d7a-8f12-000000000001' },
                    categoryId: { type: 'string', example: 'b0b89326-7c6d-4d7a-8f12-000000000001' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Product created successfully' },
            400: { description: 'Validation Error or Invalid File Format' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden (Admin role required)' },
            409: { description: 'Duplicate SKU Conflict' },
          },
        },
      },
      '/products/export': {
        get: {
          summary: 'Export products stock inventory report to CSV file',
          tags: ['Products', 'Reports'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'search', schema: { type: 'string' } },
            { in: 'query', name: 'categoryId', schema: { type: 'string' } },
            { in: 'query', name: 'supplierId', schema: { type: 'string' } },
            { in: 'query', name: 'status', schema: { type: 'string', enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'] } },
          ],
          responses: { 200: { description: 'CSV File Download' } },
        },
      },
      '/products/export/pdf': {
        get: {
          summary: 'Export products stock inventory report to PDF document',
          tags: ['Products', 'Reports'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'search', schema: { type: 'string' } },
            { in: 'query', name: 'categoryId', schema: { type: 'string' } },
            { in: 'query', name: 'supplierId', schema: { type: 'string' } },
            { in: 'query', name: 'status', schema: { type: 'string', enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK'] } },
          ],
          responses: { 200: { description: 'PDF File Download' } },
        },
      },
      '/products/{id}/qrcode': {
        get: {
          summary: 'Generate dynamic Product identity QR Code (returns PNG Image Buffer)',
          tags: ['Products'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'PNG Image Buffer return' },
            404: { description: 'Product not found' },
          },
        },
      },
      '/products/{id}': {
        get: {
          summary: 'Get details of a single product by ID',
          tags: ['Products'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Product details fetched successfully' },
            404: { description: 'Product not found' },
          },
        },
        put: {
          summary: 'Update product by ID (supports Cloudinary image upload, replacement, and removal)',
          tags: ['Products'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    productName: { type: 'string' },
                    sku: { type: 'string' },
                    description: { type: 'string' },
                    quantity: { type: 'integer' },
                    lowStockThreshold: { type: 'integer' },
                    unitPrice: { type: 'number' },
                    supplierId: { type: 'string' },
                    categoryId: { type: 'string' },
                    image: { type: 'string', format: 'binary' },
                    removeImage: { type: 'boolean', example: false },
                  },
                },
              },
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    productName: { type: 'string' },
                    sku: { type: 'string' },
                    description: { type: 'string' },
                    quantity: { type: 'integer' },
                    lowStockThreshold: { type: 'integer' },
                    unitPrice: { type: 'number' },
                    supplierId: { type: 'string' },
                    categoryId: { type: 'string' },
                    removeImage: { type: 'boolean' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Product updated successfully' },
            400: { description: 'Validation error' },
            404: { description: 'Product not found' },
          },
        },
        delete: {
          summary: 'Soft-delete product by ID and cleanup Cloudinary image',
          tags: ['Products'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Product soft deleted successfully' },
            404: { description: 'Product not found' },
          },
        },
      },
      '/products/{id}/image': {
        delete: {
          summary: 'Remove product image from Cloudinary and reset imageUrl to null',
          tags: ['Products'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Product image deleted successfully' },
            404: { description: 'Product not found' },
          },
        },
      },

      // ==================== CATEGORIES ====================
      '/categories': {
        get: {
          summary: 'Get paginated list of categories with product counts',
          tags: ['Categories'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
            { in: 'query', name: 'search', schema: { type: 'string' } },
            { in: 'query', name: 'sort', schema: { type: 'string', default: 'name' } },
            { in: 'query', name: 'order', schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' } },
          ],
          responses: { 200: { description: 'Categories fetched successfully' } },
        },
        post: {
          summary: 'Create a new category',
          tags: ['Categories'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'Electronics' },
                    description: { type: 'string', example: 'Electronic devices and accessories' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Category created successfully' },
            409: { description: 'Category name already exists' },
          },
        },
      },
      '/categories/export': {
        get: {
          summary: 'Export categories to CSV file',
          tags: ['Categories', 'Reports'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'query', name: 'search', schema: { type: 'string' } }],
          responses: { 200: { description: 'CSV File Download' } },
        },
      },
      '/categories/export/pdf': {
        get: {
          summary: 'Export categories report to PDF document',
          tags: ['Categories', 'Reports'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'query', name: 'search', schema: { type: 'string' } }],
          responses: { 200: { description: 'PDF File Download' } },
        },
      },
      '/categories/{id}': {
        get: {
          summary: 'Get category details by ID',
          tags: ['Categories'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Category details fetched successfully' } },
        },
        put: {
          summary: 'Update category by ID',
          tags: ['Categories'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Category updated successfully' } },
        },
        delete: {
          summary: 'Delete category by ID',
          tags: ['Categories'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Category deleted successfully' } },
        },
      },

      // ==================== SUPPLIERS ====================
      '/suppliers': {
        get: {
          summary: 'Get paginated list of suppliers',
          tags: ['Suppliers'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
            { in: 'query', name: 'search', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Suppliers fetched successfully' } },
        },
        post: {
          summary: 'Create a new supplier',
          tags: ['Suppliers'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: { type: 'string', example: 'TechSuppliers Inc' },
                    email: { type: 'string', example: 'contact@techsuppliers.com' },
                    phone: { type: 'string', example: '+1-555-0199' },
                    address: { type: 'string', example: '100 Industrial Parkway, Tech City' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Supplier created successfully' } },
        },
      },
      '/suppliers/export': {
        get: {
          summary: 'Export suppliers to CSV file',
          tags: ['Suppliers', 'Reports'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'query', name: 'search', schema: { type: 'string' } }],
          responses: { 200: { description: 'CSV File Download' } },
        },
      },
      '/suppliers/export/pdf': {
        get: {
          summary: 'Export suppliers report to PDF document',
          tags: ['Suppliers', 'Reports'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'query', name: 'search', schema: { type: 'string' } }],
          responses: { 200: { description: 'PDF File Download' } },
        },
      },
      '/suppliers/{id}': {
        get: {
          summary: 'Get supplier details by ID',
          tags: ['Suppliers'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Supplier details fetched successfully' } },
        },
        put: {
          summary: 'Update supplier by ID',
          tags: ['Suppliers'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    address: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Supplier updated successfully' } },
        },
        delete: {
          summary: 'Delete supplier by ID',
          tags: ['Suppliers'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Supplier deleted successfully' } },
        },
      },

      // ==================== TRANSACTIONS ====================
      '/transactions': {
        get: {
          summary: 'Get paginated stock movement audit log history',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
            { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
            { in: 'query', name: 'search', schema: { type: 'string' } },
            { in: 'query', name: 'type', schema: { type: 'string', enum: ['IN', 'OUT'] } },
            { in: 'query', name: 'productId', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Transactions history retrieved successfully' } },
        },
      },
      '/transactions/stock-in': {
        post: {
          summary: 'Perform Stock-In inventory inward transaction (+ quantity)',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productId', 'quantity'],
                  properties: {
                    productId: { type: 'string', format: 'uuid', example: '413f437b-d415-44a2-8d16-445714183982' },
                    quantity: { type: 'integer', example: 25 },
                    remarks: { type: 'string', example: 'Received shipment batch #9012' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Stock-In completed successfully' } },
        },
      },
      '/transactions/stock-out': {
        post: {
          summary: 'Perform Stock-Out inventory outward transaction (- quantity)',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productId', 'quantity'],
                  properties: {
                    productId: { type: 'string', format: 'uuid', example: '413f437b-d415-44a2-8d16-445714183982' },
                    quantity: { type: 'integer', example: 5 },
                    remarks: { type: 'string', example: 'Dispatched order #4409' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Stock-Out completed successfully' } },
        },
      },
      '/transactions/export': {
        get: {
          summary: 'Export inventory transactions audit log to CSV file',
          tags: ['Transactions', 'Reports'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'CSV File Download' } },
        },
      },
      '/transactions/export/pdf': {
        get: {
          summary: 'Export inventory transactions audit log to PDF document',
          tags: ['Transactions', 'Reports'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'PDF File Download' } },
        },
      },
      '/transactions/{id}': {
        get: {
          summary: 'Get transaction details by ID',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: { 200: { description: 'Transaction details fetched successfully' } },
        },
      },

      // ==================== DASHBOARD & HEALTH ====================
      '/dashboard/summary': {
        get: {
          summary: 'Get real-time Dashboard KPI Summary Cards metrics',
          tags: ['Dashboard'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'KPI metrics retrieved successfully' } },
        },
      },
      '/dashboard/charts': {
        get: {
          summary: 'Get Dashboard analytics chart datasets (Stock Movements & Category Distribution)',
          tags: ['Dashboard'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Analytics chart datasets retrieved successfully' } },
        },
      },
      '/health': {
        get: {
          summary: 'Health check endpoint',
          tags: ['Health'],
          responses: { 200: { description: 'Service is healthy' } },
        },
      },
    },
  },
  apis: [],
};

export const inventorySwaggerSpec = swaggerJsdoc(options);
