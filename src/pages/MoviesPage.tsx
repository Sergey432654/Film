import { twMerge } from 'tailwind-merge';

import { useFilteredMovies, useGenres, useMoviesStore } from '@/store/movies.store';

export default function MoviesPage() {
  const searchTerm = useMoviesStore((s) => s.searchTerm);
  const selectedGenre = useMoviesStore((s) => s.selectedGenre);
  const setSearchTerm = useMoviesStore((s) => s.setSearchTerm);
  const toggleGenre = useMoviesStore((s) => s.toggleGenre);
  const genres = useGenres();
  const movies = useFilteredMovies();

  return (
    <section>
      <h1 className="mb-10 text-6xl font-bold">Movies</h1>
      <input
        type="search"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="my-6 flex flex-wrap items-center gap-3">
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            className={twMerge(
              'bg-zinc-900 px-6 py-1 text-white',
              selectedGenre === genre && 'bg-purple-600',
            )}
            onClick={() => toggleGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {movies.length ? (
          movies.map((movie) => (
            <li key={movie.id} className="fade">
              {movie.title} ({movie.genre})
            </li>
          ))
        ) : (
          <li>No movies found</li>
        )}
      </ul>
    </section>
  );
}
