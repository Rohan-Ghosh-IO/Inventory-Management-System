import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').trim(),
    email: z.string().email('Invalid email address format').trim().toLowerCase(),
    password: z
      .string()
      .regex(
        passwordRegex,
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    role: z.enum(['ADMIN', 'USER']).optional().default('USER'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format').trim().toLowerCase(),
    password: z.string().min(1, 'Password is required'),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .regex(
          passwordRegex,
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: 'New password cannot be the same as your current password',
      path: ['newPassword'],
    }),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
