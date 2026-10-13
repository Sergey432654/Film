import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.url().default('http://localhost:3000/api'),
  VITE_API_MOCKS: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  VITE_API_TIMEOUT: z.coerce.number().int().positive().default(10_000),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`);
}

export const env = {
  apiUrl: parsed.data.VITE_API_URL,
  apiMocks: parsed.data.VITE_API_MOCKS,
  apiTimeout: parsed.data.VITE_API_TIMEOUT,
  isDev: import.meta.env.DEV,
} as const;
