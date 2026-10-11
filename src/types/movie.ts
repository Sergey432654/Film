export interface Movie {
  id: number;
  title: string;
  genre: string;
}

export type NewMovie = Omit<Movie, 'id'>;
