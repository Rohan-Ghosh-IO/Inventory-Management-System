import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { globalErrorHandler, requestIdMiddleware } from '@inventory/shared';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import { authSwaggerSpec } from './swagger/auth.swagger';
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

// Swagger Documentation served at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(authSwaggerSpec));

// Versioned API Routes (/api/v1)
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);

// Shared Global Error Handler
app.use(globalErrorHandler);

export default app;
