export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
