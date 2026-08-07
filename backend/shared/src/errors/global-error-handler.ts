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
  const route = req.originalUrl;
  const method = req.method;

  // Detailed server-side logger (NEVER exposed to client)
  console.error(`🔥 [SERVER ERROR] [ReqID: ${requestId || 'N/A'}] [${method} ${route}]:`, {
    timestamp,
    name: err?.name,
    message: err?.message,
    code: err?.code,
    stack: err?.stack,
  });

  // 1. Custom Controlled ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      ...(requestId && { requestId }),
      timestamp,
    });
    return;
  }

  // 2. Zod Validation Error
  if (err?.name === 'ZodError') {
    res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: Array.isArray(err?.errors)
        ? err.errors.map((e: any) => ({
            field: e.path?.join('.') || 'field',
            message: e.message || 'Invalid parameter',
          }))
        : null,
      ...(requestId && { requestId }),
      timestamp,
    });
    return;
  }

  // 3. Prisma Database Errors
  if (
    err?.code?.startsWith('P') ||
    err?.name?.includes('Prisma') ||
    err?.message?.includes('prisma') ||
    err?.message?.includes('Prisma')
  ) {
    // Unique constraint violation (P2002)
    if (err?.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'Resource already exists.',
        ...(requestId && { requestId }),
        timestamp,
      });
      return;
    }

    // Record not found (P2025)
    if (err?.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Requested resource not found.',
        ...(requestId && { requestId }),
        timestamp,
      });
      return;
    }

    // Database Connection / Offline Error (P1000, P1001, P1002, P1003, P1017, InitializationError)
    if (
      ['P1000', 'P1001', 'P1002', 'P1003', 'P1017'].includes(err?.code) ||
      err?.name === 'PrismaClientInitializationError'
    ) {
      res.status(503).json({
        success: false,
        message: 'Service is temporarily unavailable. Please try again later.',
        ...(requestId && { requestId }),
        timestamp,
      });
      return;
    }

    // Generic Prisma Error fallback
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
      ...(requestId && { requestId }),
      timestamp,
    });
    return;
  }

  // 4. JWT Verification / Library Errors
  if (
    ['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(err?.name) ||
    err?.message?.includes('jwt') ||
    err?.message?.includes('JWT')
  ) {
    res.status(401).json({
      success: false,
      message: 'Session expired. Please login again.',
      ...(requestId && { requestId }),
      timestamp,
    });
    return;
  }

  // 5. Cloudinary / Image Upload Errors
  if (
    err?.name?.includes('Cloudinary') ||
    err?.message?.includes('cloudinary') ||
    err?.message?.includes('Cloudinary')
  ) {
    res.status(500).json({
      success: false,
      message: 'Unable to upload image.',
      ...(requestId && { requestId }),
      timestamp,
    });
    return;
  }

  // 6. Generic Fallback for Uncaught 500 Exceptions
  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
    ...(requestId && { requestId }),
    timestamp,
  });
};
