import { Search, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { ROUTES } from '@/app/routes';
import { cn } from '@/lib/cn';
import { useMoviesStore } from '@/store/movies.store';

interface Props {
  className?: string;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}

export default function HeaderSearch({ className, autoFocus, onSubmitted }: Props) {
  const searchTerm = useMoviesStore((s) => s.searchTerm);
  const setSearchTerm = useMoviesStore((s) => s.setSearchTerm);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pathname !== ROUTES.movies) navigate(ROUTES.movies);
    onSubmitted?.();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={cn('relative w-full', className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400"
      />
      <input
        type="search"
        autoFocus={autoFocus}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search movies"
        aria-label="Search movies"
        className="h-10 w-full rounded-sm border border-white/10 bg-white pr-9 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-400 focus:outline-none dark:border-line dark:bg-surface-raised dark:text-fg [&::-webkit-search-cancel-button]:hidden"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm('')}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-fg"
        >
          <X className="size-4" />
        </button>
      )}
    </form>
  );
}
