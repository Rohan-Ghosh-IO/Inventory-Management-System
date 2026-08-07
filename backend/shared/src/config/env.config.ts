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

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().optional().transform((val) => (val ? parseInt(val, 10) : undefined)),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL environment variable is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET environment variable is required'),
  CORS_ORIGIN: z.string().optional().default('*'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const validateEnv = (serviceName: string): EnvConfig => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error(`❌ [${serviceName}] Invalid environment variables:`);
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }

  return result.data;
};
