import { AlertTriangle, RotateCw } from 'lucide-react';

import { toApiError } from '@/api/errors';
import { cn } from '@/lib/cn';

interface Props {
  error: unknown;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export default function QueryError({ error, onRetry, isRetrying, className }: Props) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 border border-dashed border-red-500/40 px-4 py-12 text-center',
        className,
      )}
    >
      <AlertTriangle aria-hidden className="size-8 text-red-500" />
      <div>
        <p className="font-semibold">Couldn’t load data</p>
        <p className="mt-1 text-sm text-fg-muted">{toApiError(error).message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex h-9 items-center gap-2 rounded-sm border border-line bg-surface-raised px-4 text-sm font-medium transition-colors hover:border-brand-500 disabled:opacity-60"
        >
          <RotateCw aria-hidden className={cn('size-4', isRetrying && 'animate-spin')} />
          Try again
        </button>
      )}
    </div>
  );
}
