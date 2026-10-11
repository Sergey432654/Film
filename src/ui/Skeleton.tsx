import { cn } from '@/lib/cn';

export default function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-sm bg-fg-muted/15', className)} />;
}
