import { prisma, ApiError, hashPassword, comparePassword, generateToken, UserRole } from '@inventory/shared';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Register a new User
 */
export const registerUserService = async (input: RegisterInput) => {
  const normalizedEmail = input.email.trim().toLowerCase();
  const trimmedName = input.name.trim();

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw ApiError.conflict('A user with this email address already exists');
  }

  // 2. Hash password
  const hashedPassword = await hashPassword(input.password);

  // 3. Create user in database
  const user = await prisma.user.create({
    data: {
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      role: input.role === 'ADMIN' ? UserRole.ADMIN : UserRole.USER,
    },
  });

  // 4. Return sanitized user object without password
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

/**
 * Login User and generate JWT
 */
export const loginUserService = async (input: LoginInput) => {
  const normalizedEmail = input.email.trim().toLowerCase();

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password credentials');
  }

  // 2. Compare password
  const isPasswordValid = await comparePassword(input.password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password credentials');
  }

  // 3. Generate JWT containing id, email, and role
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role as UserRole,
  });

  // 4. Return token & user details without password
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Get User Profile by ID
 */
export const getUserProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw ApiError.notFound('User profile not found');
  }

  return user;
};

/**
 * Change Password Service
 */
export const changePasswordService = async (userId: string, input: { currentPassword: string; newPassword: string }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw ApiError.notFound('User profile not found');
  }

  if (input.currentPassword === input.newPassword) {
    throw ApiError.badRequest('New password cannot be the same as your current password');
  }

  const isPasswordValid = await comparePassword(input.currentPassword, user.password);
  if (!isPasswordValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const hashedPassword = await hashPassword(input.newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Password changed successfully' };
};
