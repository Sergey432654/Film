import { SearchX } from 'lucide-react';

import GenreFilter from './GenreFilter';
import MovieCard from './MovieCard';

import { useFilteredMovies, useMoviesStore } from '@/store/movies.store';

export default function MoviesPage() {
  const searchTerm = useMoviesStore((s) => s.searchTerm);
  const resetFilters = useMoviesStore((s) => s.resetFilters);
  const movies = useFilteredMovies();
  const query = searchTerm.trim();

  return (
    <section className="container space-y-6 py-8 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-2 border-l-4 border-brand-600 pl-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Movies</h1>
          {query && (
            <p className="mt-1 text-sm text-fg-muted">
              Results for <span className="font-medium text-fg">“{query}”</span>
            </p>
          )}
        </div>
        <p className="text-sm text-fg-muted">{movies.length} titles</p>
      </header>

      <GenreFilter />

      {movies.length ? (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 border border-dashed border-line px-4 py-16 text-center">
          <SearchX aria-hidden className="size-10 text-fg-muted" />
          <p className="font-medium">No movies found</p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 hover:underline dark:text-brand-400 dark:hover:text-brand-300"
          >
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
