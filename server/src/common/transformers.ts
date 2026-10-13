import type { TransformFnParams } from 'class-transformer';
import type { ValueTransformer } from 'typeorm';

/** Trims strings, leaves other values untouched for the validator to reject. */
export const trim = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

/** Trims strings and turns empty ones into `undefined` (for optional fields). */
export const trimToUndefined = ({ value }: TransformFnParams): unknown => {
  if (typeof value !== 'string') return value;
  return value.trim() || undefined;
};

/**
 * Drops `null` from responses: the key becomes `undefined` and disappears from JSON,
 * because the client schema treats optional fields as absent, not `null`.
 */
export const nullToUndefined = ({ value }: TransformFnParams): unknown => value ?? undefined;

/** Postgres returns `numeric` as a string; keep it a number in the entity. */
export const numericTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => (value === null || value === undefined ? null : Number(value)),
};
