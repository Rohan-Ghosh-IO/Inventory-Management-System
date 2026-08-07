import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';

const possiblePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(process.cwd(), '../../.env'),
  path.resolve(__dirname, '../../../../.env'),
  path.resolve(__dirname, '../../../.env'),
];

for (const envPath of possiblePaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT_AUTH: z.string().transform((val) => parseInt(val, 10)).default('5001'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

export const env = envSchema.parse(process.env);
