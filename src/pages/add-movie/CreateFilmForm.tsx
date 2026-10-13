import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';

import { describedBy, fieldClass } from './field';
import FormField from './FormField';

import { toApiError } from '@/api/errors';
import { useCreateMovie, useGenres } from '@/api/movies/movies.queries';
import {
  createMovieSchema,
  DESCRIPTION_MAX,
  MAX_YEAR,
  MIN_YEAR,
  type CreateMovieDto,
  type CreateMovieInput,
  type Movie,
} from '@/api/movies/movies.schemas';
import { cn } from '@/lib/cn';

interface Props {
  onCreated?: (movie: Movie) => void;
}

const FIELDS = ['title', 'genre', 'year', 'rating', 'description'] as const;
type Field = (typeof FIELDS)[number];

const isField = (name: string): name is Field => (FIELDS as readonly string[]).includes(name);

const toOptionalNumber = (value: unknown) =>
  value === '' || value === null || value === undefined ? undefined : Number(value);

const DEFAULT_VALUES: CreateMovieInput = { title: '', genre: '', description: '' };

export default function CreateFilmForm({ onCreated }: Props) {
  const { data: genres = [] } = useGenres();
  const createMovie = useCreateMovie();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateMovieInput, unknown, CreateMovieDto>({
    resolver: zodResolver(createMovieSchema),
    mode: 'onTouched',
    defaultValues: DEFAULT_VALUES,
  });

  const description = useWatch({ control, name: 'description' }) ?? '';

  const onSubmit: SubmitHandler<CreateMovieDto> = async (dto) => {
    try {
      const movie = await createMovie.mutateAsync(dto);
      reset(DEFAULT_VALUES);
      onCreated?.(movie);
    } catch (error) {
      const apiError = toApiError(error);
      const fieldEntries = Object.entries(apiError.fieldErrors).filter(([name]) => isField(name));

      fieldEntries.forEach(([name, message], index) =>
        setError(name as Field, { type: 'server', message }, { shouldFocus: index === 0 }),
      );
      setError('root.server', { type: String(apiError.status), message: apiError.message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {errors.root?.server && (
        <div
          role="alert"
          className="flex items-start gap-2 border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-sm text-red-700 dark:text-red-300"
        >
          <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
          {errors.root.server.message}
        </div>
      )}

      <fieldset disabled={isSubmitting} className="space-y-5">
        <FormField id="title" label="Title" required error={errors.title?.message}>
          <input
            id="title"
            type="text"
            autoComplete="off"
            placeholder="e.g. Blade Runner 2049"
            aria-invalid={!!errors.title}
            aria-describedby={describedBy('title', errors.title?.message)}
            className={cn(fieldClass(!!errors.title), 'h-11')}
            {...register('title')}
          />
        </FormField>

        <FormField
          id="genre"
          label="Genre"
          required
          error={errors.genre?.message}
          hint="Pick an existing genre or type a new one"
        >
          <input
            id="genre"
            type="text"
            list="genre-options"
            autoComplete="off"
            placeholder="e.g. Sci-Fi"
            aria-invalid={!!errors.genre}
            aria-describedby={describedBy('genre', errors.genre?.message, true)}
            className={cn(fieldClass(!!errors.genre), 'h-11')}
            {...register('genre')}
          />
          <datalist id="genre-options">
            {genres.map((genre) => (
              <option key={genre} value={genre} />
            ))}
          </datalist>
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="year"
            label="Release year"
            error={errors.year?.message}
            hint={`${MIN_YEAR}–${MAX_YEAR}`}
          >
            <input
              id="year"
              type="number"
              inputMode="numeric"
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              placeholder="2017"
              aria-invalid={!!errors.year}
              aria-describedby={describedBy('year', errors.year?.message, true)}
              className={cn(fieldClass(!!errors.year), 'h-11')}
              {...register('year', { setValueAs: toOptionalNumber })}
            />
          </FormField>

          <FormField
            id="rating"
            label="Rating"
            error={errors.rating?.message}
            hint="From 0 to 10, e.g. 8.4"
          >
            <input
              id="rating"
              type="number"
              inputMode="decimal"
              min={0}
              max={10}
              step={0.1}
              placeholder="8.4"
              aria-invalid={!!errors.rating}
              aria-describedby={describedBy('rating', errors.rating?.message, true)}
              className={cn(fieldClass(!!errors.rating), 'h-11')}
              {...register('rating', { setValueAs: toOptionalNumber })}
            />
          </FormField>
        </div>

        <FormField
          id="description"
          label="Description"
          error={errors.description?.message}
          hint={
            <span className={cn(description.length > DESCRIPTION_MAX && 'text-red-500')}>
              {description.length}/{DESCRIPTION_MAX}
            </span>
          }
        >
          <textarea
            id="description"
            rows={4}
            placeholder="A few words about the movie"
            aria-invalid={!!errors.description}
            aria-describedby={describedBy('description', errors.description?.message, true)}
            className={cn(fieldClass(!!errors.description), 'resize-y py-2.5')}
            {...register('description')}
          />
        </FormField>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => reset(DEFAULT_VALUES)}
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-sm border border-line px-5 text-sm font-semibold transition-colors hover:border-fg-muted disabled:opacity-60"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-60"
        >
          {isSubmitting && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {isSubmitting ? 'Saving…' : 'Add movie'}
        </button>
      </div>
    </form>
  );
}
