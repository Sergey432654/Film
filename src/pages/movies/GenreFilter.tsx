import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { useGenres, useMoviesStore } from '@/store/movies.store';

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 rounded-sm border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-line bg-surface-raised text-fg hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-300',
      )}
    >
      {children}
    </button>
  );
}

export default function GenreFilter() {
  const genres = useGenres();
  const selectedGenre = useMoviesStore((s) => s.selectedGenre);
  const setGenre = useMoviesStore((s) => s.setGenre);
  const toggleGenre = useMoviesStore((s) => s.toggleGenre);

  return (
    <div className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      <Chip active={selectedGenre === null} onClick={() => setGenre(null)}>
        All
      </Chip>
      {genres.map((genre) => (
        <Chip key={genre} active={selectedGenre === genre} onClick={() => toggleGenre(genre)}>
          {genre}
        </Chip>
      ))}
    </div>
  );
}
