import { registerAs, type ConfigType } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: Number(process.env.PORT ?? 3000),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
}));

export type AppConfig = ConfigType<typeof appConfig>;
