import { useForm, type SubmitHandler } from 'react-hook-form';

import { cn } from '@/lib/cn';
import { useGenres, useMoviesStore } from '@/store/movies.store';
import type { Movie, NewMovie } from '@/types/movie';

interface Props {
  onCreated?: (movie: Movie) => void;
}

const notBlank = (message: string) => (value: string) => value.trim() !== '' || message;

const inputClass = (invalid: boolean) =>
  cn(
    'block h-11 w-full rounded-sm border bg-surface-raised px-3 text-sm text-fg transition-colors placeholder:text-fg-muted focus:outline-none',
    invalid
      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
      : 'border-line hover:border-fg-muted focus:border-brand-600 focus:ring-1 focus:ring-brand-600',
  );

export default function CreateFilmForm({ onCreated }: Props) {
  const addMovie = useMoviesStore((s) => s.addMovie);
  const genres = useGenres();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewMovie>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<NewMovie> = (data) => {
    const movie = addMovie({ title: data.title.trim(), genre: data.genre.trim() });
    reset();
    onCreated?.(movie);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="title" className="block text-sm font-medium text-fg">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Blade Runner 2049"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
          className={inputClass(!!errors.title)}
          {...register('title', {
            required: 'Title is required',
            validate: notBlank('Title is required'),
          })}
        />
        {errors.title && (
          <p id="title-error" className="text-sm text-red-600">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="genre" className="block text-sm font-medium text-fg">
          Genre
        </label>
        <input
          id="genre"
          type="text"
          list="genre-options"
          placeholder="Pick or type a genre"
          aria-invalid={!!errors.genre}
          aria-describedby={errors.genre ? 'genre-error' : undefined}
          className={inputClass(!!errors.genre)}
          {...register('genre', {
            required: 'Genre is required',
            validate: notBlank('Genre is required'),
          })}
        />
        <datalist id="genre-options">
          {genres.map((genre) => (
            <option key={genre} value={genre} />
          ))}
        </datalist>
        {errors.genre && (
          <p id="genre-error" className="text-sm text-red-600">
            {errors.genre.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-11 w-full items-center justify-center rounded-sm bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-60 sm:w-auto"
      >
        Add movie
      </button>
    </form>
  );
}
