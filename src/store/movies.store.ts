import { useMemo } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { MOVIES } from '@/data/movies';
import type { Movie, NewMovie } from '@/types/movie';

interface MoviesState {
  movies: Movie[];
  searchTerm: string;
  selectedGenre: string | null;
}

interface MoviesActions {
  addMovie: (movie: NewMovie) => Movie;
  setSearchTerm: (searchTerm: string) => void;
  setGenre: (genre: string | null) => void;
  toggleGenre: (genre: string) => void;
  resetFilters: () => void;
}

export type MoviesStore = MoviesState & MoviesActions;

const nextId = (movies: Movie[]) => movies.reduce((max, m) => Math.max(max, m.id), 0) + 1;

export const useMoviesStore = create<MoviesStore>()(
  devtools(
    (set, get) => ({
      movies: MOVIES,
      searchTerm: '',
      selectedGenre: null,

      addMovie: (data) => {
        const movie: Movie = { id: nextId(get().movies), ...data };
        set((state) => ({ movies: [...state.movies, movie] }), undefined, 'movies/add');
        return movie;
      },
      setSearchTerm: (searchTerm) => set({ searchTerm }, undefined, 'filters/search'),
      setGenre: (selectedGenre) => set({ selectedGenre }, undefined, 'filters/setGenre'),
      toggleGenre: (genre) =>
        set(
          (state) => ({ selectedGenre: state.selectedGenre === genre ? null : genre }),
          undefined,
          'filters/toggleGenre',
        ),
      resetFilters: () => set({ searchTerm: '', selectedGenre: null }, undefined, 'filters/reset'),
    }),
    { name: 'movies', enabled: import.meta.env.DEV },
  ),
);

export function useGenres() {
  const movies = useMoviesStore((s) => s.movies);
  return useMemo(() => Array.from(new Set(movies.map((m) => m.genre))), [movies]);
}

export function useFilteredMovies() {
  const movies = useMoviesStore((s) => s.movies);
  const searchTerm = useMoviesStore((s) => s.searchTerm);
  const selectedGenre = useMoviesStore((s) => s.selectedGenre);

  return useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return movies.filter(
      (m) => m.title.toLowerCase().includes(query) && (!selectedGenre || m.genre === selectedGenre),
    );
  }, [movies, searchTerm, selectedGenre]);
}
