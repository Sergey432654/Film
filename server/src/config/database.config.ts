import { registerAs, type ConfigType } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? '',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? '',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
}));

export type DatabaseConfig = ConfigType<typeof databaseConfig>;
