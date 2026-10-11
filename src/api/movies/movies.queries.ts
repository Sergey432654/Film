import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { moviesApi } from './movies.api';
import type { Movie } from './movies.schemas';

import { useFiltersStore } from '@/store/filters.store';

export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: number) => [...movieKeys.details(), id] as const,
};

export const moviesListOptions = () =>
  queryOptions({
    queryKey: movieKeys.lists(),
    queryFn: ({ signal }) => moviesApi.list(signal),
  });

export const movieDetailOptions = (id: number) =>
  queryOptions({
    queryKey: movieKeys.detail(id),
    queryFn: ({ signal }) => moviesApi.getById(id, signal),
  });

export function useMovies<T = Movie[]>(select?: (movies: Movie[]) => T) {
  return useQuery({ ...moviesListOptions(), select });
}

export function useMovie(id: number) {
  return useQuery(movieDetailOptions(id));
}

const selectGenres = (movies: Movie[]) => Array.from(new Set(movies.map((m) => m.genre)));

const selectGenreStats = (movies: Movie[]) => {
  const counts = new Map<string, number>();
  movies.forEach((m) => counts.set(m.genre, (counts.get(m.genre) ?? 0) + 1));
  return Array.from(counts, ([genre, count]) => ({ genre, count })).sort(
    (a, b) => b.count - a.count || a.genre.localeCompare(b.genre),
  );
};

export function useGenres() {
  return useMovies(selectGenres);
}

export function useGenreStats() {
  return useMovies(selectGenreStats);
}

export function useTopMovies(limit = 10) {
  const select = useCallback(
    (movies: Movie[]) =>
      movies
        .filter((m) => m.rating !== undefined)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, limit),
    [limit],
  );
  return useMovies(select);
}

export function useFilteredMovies() {
  const searchTerm = useFiltersStore((s) => s.searchTerm);
  const selectedGenre = useFiltersStore((s) => s.selectedGenre);

  const select = useCallback(
    (movies: Movie[]) => {
      const query = searchTerm.trim().toLowerCase();
      return movies.filter(
        (m) =>
          m.title.toLowerCase().includes(query) && (!selectedGenre || m.genre === selectedGenre),
      );
    },
    [searchTerm, selectedGenre],
  );

  return useMovies(select);
}

export function useCreateMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moviesApi.create,
    onSuccess: (movie) => {
      queryClient.setQueryData(movieKeys.detail(movie.id), movie);
      return queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
    },
  });
}
