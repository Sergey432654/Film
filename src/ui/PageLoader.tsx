import { Loader2 } from 'lucide-react';

export default function PageLoader() {
  return (
    <div role="status" className="flex min-h-[50dvh] items-center justify-center">
      <Loader2 aria-hidden className="size-8 animate-spin text-brand-500" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
