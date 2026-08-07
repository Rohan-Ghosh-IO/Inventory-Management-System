import express from 'express';

import { validateRequest, authenticateJwt } from '@inventory/shared';

import { registerSchema, loginSchema, changePasswordSchema } from '../validators/auth.validator';
import {
  registerController,
  loginController,
  getMeController,
  changePasswordController,
  logoutController,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), registerController);
router.post('/login', validateRequest(loginSchema), loginController);
router.get('/me', authenticateJwt, getMeController);
router.post('/change-password', authenticateJwt, validateRequest(changePasswordSchema), changePasswordController);
router.post('/logout', logoutController);

export default router;
