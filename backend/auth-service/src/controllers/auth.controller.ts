import { Request, Response, NextFunction } from 'express';

import { sendResponse, AuthenticatedRequest, HTTP_STATUS } from '@inventory/shared';

import {
  registerUserService,
  loginUserService,
  getUserProfileService,
  changePasswordService,
} from '../services/auth.service';

export const registerController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await registerUserService(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, 'User registered successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await loginUserService(req.body);

    return sendResponse(res, HTTP_STATUS.OK, 'Login successful', result);
  } catch (error: any) {
    next(error);
  }
};

export const getMeController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const result = await getUserProfileService(userId);

    return sendResponse(res, HTTP_STATUS.OK, 'Current user profile fetched successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const changePasswordController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const result = await changePasswordService(userId, req.body);

    return sendResponse(res, HTTP_STATUS.OK, 'Password changed successfully', result);
  } catch (error: any) {
    next(error);
  }
};

export const logoutController = async (_req: Request, res: Response): Promise<void> => {
  return sendResponse(res, HTTP_STATUS.OK, 'Logged out successfully');
};
