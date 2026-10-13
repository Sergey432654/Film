import { z } from 'zod';

import { createMovieSchema } from '../movies/movies.schemas';

import { db } from './db';

export interface MockRequest {
  params: Record<string, string>;
  body: unknown;
}

export interface MockResponse {
  status: number;
  data?: unknown;
}

export interface MockRoute {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  handler: (request: MockRequest) => MockResponse;
}

const notFound = (message: string): MockResponse => ({ status: 404, data: { message } });

export const routes: MockRoute[] = [
  {
    method: 'get',
    path: '/movies',
    handler: () => ({ status: 200, data: db.movies.list() }),
  },
  {
    method: 'get',
    path: '/movies/:id',
    handler: ({ params }) => {
      const movie = db.movies.find(Number(params.id));
      return movie ? { status: 200, data: movie } : notFound('Movie not found');
    },
  },
  {
    method: 'post',
    path: '/movies',
    handler: ({ body }) => {
      const parsed = createMovieSchema.safeParse(body);

      if (!parsed.success) {
        const { fieldErrors } = z.flattenError(parsed.error);
        const errors = Object.fromEntries(
          Object.entries(fieldErrors).map(([field, messages]) => [field, messages?.[0] ?? '']),
        );
        return { status: 422, data: { message: 'Some fields are invalid.', errors } };
      }

      if (db.movies.findByTitle(parsed.data.title)) {
        return {
          status: 409,
          data: {
            message: 'This movie is already in the catalogue.',
            errors: { title: 'A movie with this title already exists' },
          },
        };
      }

      return { status: 201, data: db.movies.insert(parsed.data) };
    },
  },
];
