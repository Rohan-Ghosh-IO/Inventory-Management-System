import { Response } from 'express';
import { ApiResponse } from '../types/api-response.type';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  meta?: ApiResponse['meta']
): void => {
  const requestId = res.req?.requestId;
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
    meta,
    ...(requestId && { requestId }),
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};
