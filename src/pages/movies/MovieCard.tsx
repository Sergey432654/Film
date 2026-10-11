import { Film, Star } from 'lucide-react';

import type { Movie } from '@/types/movie';

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  return (
    <article className="group animate-fade-in">
      <div className="relative flex aspect-2/3 items-center justify-center overflow-hidden rounded-sm bg-linear-to-br from-brand-700 via-brand-900 to-brand-950 ring-1 ring-black/5 transition group-hover:ring-2 group-hover:ring-brand-500">
        <Film
          aria-hidden
          className="size-10 text-white/25 transition-transform duration-300 group-hover:scale-110"
        />
        <span className="absolute top-2 left-2 rounded-xs bg-black/40 px-1.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
          {movie.genre}
        </span>
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm leading-snug font-semibold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400">
        {movie.title}
      </h3>
      {(movie.year || movie.rating) && (
        <p className="mt-0.5 flex items-center gap-2 text-xs text-fg-muted">
          {movie.year && <span>{movie.year}</span>}
          {movie.rating && (
            <span className="inline-flex items-center gap-0.5">
              <Star aria-hidden className="size-3 fill-amber-400 text-amber-400" />
              {movie.rating.toFixed(1)}
            </span>
          )}
        </p>
      )}
    </article>
  );
}
