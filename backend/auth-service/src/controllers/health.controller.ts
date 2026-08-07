import { Request, Response, NextFunction } from 'express';

import { prisma, sendResponse, HTTP_STATUS } from '@inventory/shared';

export const getHealthStatusController = (_req: Request, res: Response): void => {
  return sendResponse(res, HTTP_STATUS.OK, 'Auth service is healthy', {
    service: 'auth-service',
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
  });
};

export const getReadinessStatusController = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return sendResponse(res, HTTP_STATUS.OK, 'Auth service is ready and database connection is healthy', {
      service: 'auth-service',
      status: 'READY',
      database: 'CONNECTED',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    next(error);
  }
};
