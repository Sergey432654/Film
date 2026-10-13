import axios from 'axios';

import { toApiError } from './errors';
import { mockAdapter } from './mock/adapter';

import { env } from '@/config/env';

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  adapter: env.apiMocks ? mockAdapter : undefined,
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);
