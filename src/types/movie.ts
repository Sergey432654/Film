export interface Movie {
  id: number;
  title: string;
  genre: string;
  year?: number;
  rating?: number;
}

export type NewMovie = Pick<Movie, 'title' | 'genre'>;
