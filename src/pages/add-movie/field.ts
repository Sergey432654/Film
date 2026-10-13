import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

export const fieldClass = (invalid: boolean) =>
  cn(
    'block w-full rounded-sm border bg-surface-raised px-3 text-sm text-fg transition-colors placeholder:text-fg-muted focus:outline-none disabled:opacity-60',
    invalid
      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
      : 'border-line hover:border-fg-muted focus:border-brand-600 focus:ring-1 focus:ring-brand-600',
  );

export const describedBy = (id: string, error?: string, hint?: ReactNode) =>
  [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;
