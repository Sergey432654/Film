import { http } from '../http';

import { movieSchema, moviesSchema, type CreateMovieDto, type Movie } from './movies.schemas';

export const moviesApi = {
  async list(signal?: AbortSignal): Promise<Movie[]> {
    const { data } = await http.get('/movies', { signal });
    return moviesSchema.parse(data);
  },

  async getById(id: number, signal?: AbortSignal): Promise<Movie> {
    const { data } = await http.get(`/movies/${id}`, { signal });
    return movieSchema.parse(data);
  },

  async create(dto: CreateMovieDto): Promise<Movie> {
    const { data } = await http.post('/movies', dto);
    return movieSchema.parse(data);
  },
};
