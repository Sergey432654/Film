import { moviesSchema, type CreateMovieDto, type Movie } from '../movies/movies.schemas';

import { SEED_MOVIES } from './seed';

const STORAGE_KEY = 'film-mock-db';

function load(): Movie[] {
  try {
    const parsed = moviesSchema.safeParse(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'));
    return parsed.success ? parsed.data : [...SEED_MOVIES];
  } catch {
    return [...SEED_MOVIES];
  }
}

let movies = load();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  } catch {
    return;
  }
}

export const db = {
  movies: {
    list: () => [...movies],
    find: (id: number) => movies.find((m) => m.id === id),
    findByTitle: (title: string) =>
      movies.find((m) => m.title.toLowerCase() === title.trim().toLowerCase()),
    insert: (dto: CreateMovieDto) => {
      const movie: Movie = { id: Math.max(0, ...movies.map((m) => m.id)) + 1, ...dto };
      movies = [...movies, movie];
      save();
      return movie;
    },
    reset: () => {
      movies = [...SEED_MOVIES];
      save();
    },
  },
};
