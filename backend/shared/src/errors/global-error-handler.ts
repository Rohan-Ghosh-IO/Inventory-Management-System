import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError } from './api-error';

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  const requestId = req.requestId;

  // 1. Handle Custom ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
      ...(requestId && { requestId }),
      timestamp,
    });
    return;
  }

  // 2. Handle Zod Validation Errors
  if (err?.name === 'ZodError') {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors,
      ...(requestId && { requestId }),
      timestamp,
    });
    return;
  }

  // 3. Handle Prisma Errors
  if (err?.code === 'P2002') {
    res.status(409).json({
      success: false,
      message: 'Unique constraint violation. Entity already exists.',
      errors: err.meta,
      ...(requestId && { requestId }),
      timestamp,
    });
    return;
  }

  if (err?.code === 'P2025') {
    res.status(404).json({
      success: false,
      message: 'Record not found in database.',
      errors: err.meta,
      ...(requestId && { requestId }),
      timestamp,
    });
    return;
  }

  // 4. Default Internal Server Error (Uncaught exceptions)
  console.error(`🔥 [Unhandled Error] [ReqID: ${requestId || 'N/A'}]:`, err);

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Internal server error',
    ...(requestId && { requestId }),
    timestamp,
  });
};
