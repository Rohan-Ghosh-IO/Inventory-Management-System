import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { prisma, globalErrorHandler, sendResponse, HTTP_STATUS, requestIdMiddleware } from '@inventory/shared';
import categoryRoutes from './routes/category.routes';
import supplierRoutes from './routes/supplier.routes';
import productRoutes from './routes/product.routes';
import transactionRoutes from './routes/transaction.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { inventorySwaggerSpec } from './swagger/inventory.swagger';
import { env } from './config/env.config';

const app: Application = express();

app.disable('x-powered-by');

// Security & Utility Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL || '*',
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(requestIdMiddleware);

// Morgan Request Logging
morgan.token('req-id', (req: express.Request) => req.requestId || 'N/A');
const morganFormat =
  env.NODE_ENV === 'production'
    ? ':remote-addr - :req-id ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms'
    : ':method :url :status :response-time ms - ReqID: :req-id';

app.use(morgan(morganFormat));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(inventorySwaggerSpec));

// Health & Readiness Check Endpoints
app.get('/api/v1/health', (_req, res) => {
  sendResponse(res, HTTP_STATUS.OK, 'Inventory Microservice is healthy', {
    service: 'inventory-service',
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
  });
});

app.get(['/api/v1/readiness', '/api/v1/health/readiness'], async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    sendResponse(res, HTTP_STATUS.OK, 'Inventory service is ready and database connection is healthy', {
      service: 'inventory-service',
      status: 'READY',
      database: 'CONNECTED',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Domain Routes
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
