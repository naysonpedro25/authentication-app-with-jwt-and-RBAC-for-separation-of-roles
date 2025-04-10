import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'production', 'test']),
    PORT: z.coerce.number().default(3000),
    EMAIL_ADDRESS: z.string(),
    EMAIL_PASS: z.string(),
    JWT_SECRET: z.string(),
    FRONTEND_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.error) {
    console.error('Environment variables invalid', _env.error.format());
    throw new Error('Environment variables invalid');
}

export const env = _env.data;
