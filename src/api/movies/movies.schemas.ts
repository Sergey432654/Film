import { z } from 'zod';

export const MIN_YEAR = 1888;
export const MAX_YEAR = new Date().getFullYear() + 5;
export const TITLE_MAX = 120;
export const GENRE_MAX = 40;
export const DESCRIPTION_MAX = 500;

export const movieSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  genre: z.string(),
  year: z.number().int().optional(),
  rating: z.number().optional(),
  description: z.string().optional(),
});

export const moviesSchema = z.array(movieSchema);

const hasAtMostOneDecimal = (value: number) => Math.abs(value * 10 - Math.round(value * 10)) < 1e-9;

export const createMovieSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(TITLE_MAX, `Title must be at most ${TITLE_MAX} characters`),
  genre: z
    .string()
    .trim()
    .min(2, 'Genre must be at least 2 characters')
    .max(GENRE_MAX, `Genre must be at most ${GENRE_MAX} characters`)
    .regex(/^[\p{L}][\p{L}\s&'-]*$/u, 'Genre can contain only letters, spaces, “&”, “-” and “’”'),
  year: z
    .number({ error: 'Year must be a number' })
    .int('Year must be a whole number')
    .min(MIN_YEAR, `Year must be ${MIN_YEAR} or later`)
    .max(MAX_YEAR, `Year must be ${MAX_YEAR} or earlier`)
    .optional(),
  rating: z
    .number({ error: 'Rating must be a number' })
    .min(0, 'Rating must be between 0 and 10')
    .max(10, 'Rating must be between 0 and 10')
    .refine(hasAtMostOneDecimal, 'Use at most one decimal place')
    .optional(),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX, `Description must be at most ${DESCRIPTION_MAX} characters`)
    .optional()
    .transform((value) => value || undefined),
});

export type Movie = z.infer<typeof movieSchema>;
export type CreateMovieInput = z.input<typeof createMovieSchema>;
export type CreateMovieDto = z.output<typeof createMovieSchema>;
