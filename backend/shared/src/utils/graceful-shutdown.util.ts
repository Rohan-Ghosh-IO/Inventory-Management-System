import { Server } from 'http';
import { prisma } from '../config/prisma.client';

export const setupGracefulShutdown = (server: Server, serviceName: string): void => {
  const shutdown = (signal: string) => {
    console.log(`\n🛑 [${serviceName}] Received ${signal}. Starting graceful shutdown...`);

    server.close(async () => {
      console.log(`🔒 [${serviceName}] HTTP server closed.`);
      try {
        await prisma.$disconnect();
        console.log(`🔌 [${serviceName}] Database connection closed.`);
        process.exit(0);
      } catch (err) {
        console.error(`❌ [${serviceName}] Error during database disconnection:`, err);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds if graceful shutdown hangs
    setTimeout(() => {
      console.error(`⚠️ [${serviceName}] Forced shutdown timeout exceeded. Exiting.`);
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};
