import { isAxiosError } from 'axios';
import { z } from 'zod';

const errorBodySchema = z.object({
  message: z.string().optional(),
  errors: z.record(z.string(), z.string()).optional(),
});

export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FieldErrors;

  constructor(message: string, status: number, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }

  get isNetworkError() {
    return this.status === 0;
  }

  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  get isValidationError() {
    return this.status === 422 || (this.status === 400 && Object.keys(this.fieldErrors).length > 0);
  }
}

const DEFAULT_MESSAGES: Record<number, string> = {
  0: 'Network error. Check your connection and try again.',
  401: 'You need to sign in to continue.',
  403: 'You don’t have permission to do this.',
  404: 'The requested resource was not found.',
  408: 'The request timed out. Please try again.',
  422: 'Some fields are invalid.',
  500: 'Server error. Please try again later.',
};

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError(DEFAULT_MESSAGES[408], 408);
    }

    const status = error.response?.status ?? 0;
    const body = errorBodySchema.safeParse(error.response?.data);
    const message =
      (body.success && body.data.message) ||
      DEFAULT_MESSAGES[status] ||
      (status >= 500 ? DEFAULT_MESSAGES[500] : error.message);

    return new ApiError(message, status, body.success ? body.data.errors : undefined);
  }

  if (error instanceof z.ZodError) {
    return new ApiError('Unexpected response from the server.', 0);
  }

  return new ApiError(error instanceof Error ? error.message : 'Something went wrong', 0);
}
