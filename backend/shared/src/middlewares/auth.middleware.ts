import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api-error';
import { verifyToken } from '../utils/jwt.util';
import { UserRole } from '../types/user.type';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export const authenticateJwt = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('No authentication token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(ApiError.unauthorized('User is not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to access this resource'));
    }

    next();
  };
};
