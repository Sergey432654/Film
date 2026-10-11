import { useForm, type SubmitHandler } from 'react-hook-form';

import { useMoviesStore } from '@/store/movies.store';
import type { Movie, NewMovie } from '@/types/movie';

interface Props {
  onCreated?: (movie: Movie) => void;
}

const notBlank = (message: string) => (value: string) => value.trim() !== '' || message;

export function CreateFilmForm({ onCreated }: Props) {
  const addMovie = useMoviesStore((s) => s.addMovie);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewMovie>({ mode: 'onChange' });

  const onSubmit: SubmitHandler<NewMovie> = (data) => {
    const movie = addMovie({ title: data.title.trim(), genre: data.genre.trim() });
    reset();
    onCreated?.(movie);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-sm flex-col gap-2">
      <div>
        <input
          {...register('title', {
            required: 'Title is required',
            validate: notBlank('Title is required'),
          })}
          type="text"
          placeholder="Movie title"
          className="block w-full"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <input
          {...register('genre', {
            required: 'Genre is required',
            validate: notBlank('Genre is required'),
          })}
          type="text"
          placeholder="Movie genre"
          className="block w-full"
        />
        {errors.genre && <p className="text-red-500">{errors.genre.message}</p>}
      </div>
      <button type="submit" className="self-start bg-red-400 text-white">
        Add film
      </button>
    </form>
  );
}
