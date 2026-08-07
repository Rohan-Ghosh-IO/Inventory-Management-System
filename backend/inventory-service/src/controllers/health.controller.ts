import { Request, Response } from 'express';

import { sendResponse, HTTP_STATUS } from '@inventory/shared';

export const getHealthStatusController = (_req: Request, res: Response): void => {
  return sendResponse(res, HTTP_STATUS.OK, 'Inventory service is healthy', {
    service: 'inventory-service',
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
  });
};
