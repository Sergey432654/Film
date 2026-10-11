import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

import { ROUTES } from '@/app/routes';
import { useGenreStats, useMoviesStore } from '@/store/movies.store';

import SectionHeading from './SectionHeading';

export default function GenresSection() {
  const genres = useGenreStats();
  const browseGenre = useMoviesStore((s) => s.browseGenre);
  const resetFilters = useMoviesStore((s) => s.resetFilters);

  return (
    <section
      aria-labelledby="genres-title"
      className="border-y border-line bg-surface-muted py-14 sm:py-20"
    >
      <div className="container">
        <SectionHeading
          id="genres-title"
          eyebrow="Explore"
          title="Browse by genre"
          action={
            <Link
              to={ROUTES.movies}
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
            >
              View all movies
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          }
        />

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {genres.map(({ genre, count }) => (
            <li key={genre}>
              <Link
                to={ROUTES.movies}
                onClick={() => browseGenre(genre)}
                className="group flex h-full items-center justify-between gap-3 border border-l-4 border-line border-l-brand-600 bg-surface-raised px-4 py-4 transition-colors hover:border-brand-500 sm:px-5"
              >
                <span>
                  <span className="block font-semibold group-hover:text-brand-600 dark:group-hover:text-brand-400">
                    {genre}
                  </span>
                  <span className="text-sm text-fg-muted">
                    {count} {count === 1 ? 'title' : 'titles'}
                  </span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="size-4 shrink-0 text-fg-muted transition-transform group-hover:translate-x-1 group-hover:text-brand-500"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
