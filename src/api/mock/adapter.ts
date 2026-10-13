import {
  AxiosError,
  AxiosHeaders,
  CanceledError,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { routes, type MockResponse } from './routes';

const MIN_DELAY = 250;
const MAX_DELAY = 650;

const compiled = routes.map((route) => ({
  ...route,
  keys: [...route.path.matchAll(/:(\w+)/g)].map(([, key]) => key),
  regex: new RegExp(`^${route.path.replace(/:\w+/g, '([^/]+)')}/?$`),
}));

function wait(config: InternalAxiosRequestConfig) {
  const ms = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);
  const { signal } = config;

  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new CanceledError(undefined, undefined, config));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener?.('abort', () => {
      clearTimeout(timer);
      reject(new CanceledError(undefined, undefined, config));
    });
  });
}

function parseBody(data: unknown) {
  if (typeof data !== 'string') return data;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

function resolveRoute(config: InternalAxiosRequestConfig): MockResponse {
  const method = (config.method ?? 'get').toLowerCase();
  const path = (config.url ?? '').split('?')[0];

  for (const route of compiled) {
    if (route.method !== method) continue;
    const match = route.regex.exec(path);
    if (!match) continue;

    const params = Object.fromEntries(
      route.keys.map((key, i) => [key, decodeURIComponent(match[i + 1])]),
    );
    return route.handler({ params, body: parseBody(config.data) });
  }

  return { status: 404, data: { message: `No mock for ${method.toUpperCase()} ${path}` } };
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await wait(config);

  const { status, data } = resolveRoute(config);
  const response: AxiosResponse = {
    data,
    status,
    statusText: String(status),
    headers: new AxiosHeaders({ 'content-type': 'application/json' }),
    config,
    request: { mocked: true },
  };

  if (status >= 400) {
    throw new AxiosError(
      `Request failed with status code ${status}`,
      status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
      config,
      response.request,
      response,
    );
  }

  return response;
};
