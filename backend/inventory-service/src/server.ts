import app from './app';
import { env } from './config/env.config';
import { logger, validateEnv, setupGracefulShutdown } from '@inventory/shared';

// 1. Validate required environment variables on startup
validateEnv('Inventory Service');

const PORT = env.PORT_INVENTORY;

// 2. Start HTTP Server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Inventory Service running on port ${PORT} [${env.NODE_ENV}]`);
  logger.info(`📚 Inventory Swagger docs available at http://localhost:${PORT}/api-docs`);
});

// 3. Register Graceful Shutdown Handler (SIGINT, SIGTERM)
setupGracefulShutdown(server, 'Inventory Service');

process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});
