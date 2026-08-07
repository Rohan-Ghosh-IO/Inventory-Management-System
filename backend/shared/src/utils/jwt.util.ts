import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/user.type';

const getJwtSecret = (): string => process.env.JWT_SECRET || 'super_secret_jwt_key_default';
const getJwtExpiresIn = (): string => process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};
