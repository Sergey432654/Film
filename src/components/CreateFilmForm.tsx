import { SubmitHandler, useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { MOVIES, Tmovies } from "../data.film"


type TCreateMovieForm = Pick<Tmovies, 'title' | 'genre'>

interface Props {
  setMovieList: Dispatch<SetStateAction<Tmovies[]>>
}

export function CreateFilmForm({ setMovieList }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateMovieForm>({
    mode: "onChange",
  })

  const onSubmit: SubmitHandler<TCreateMovieForm> = (data) => {
    const newMovie: Tmovies = {
      id: MOVIES.length + 1,
      ...data,
    }
    setMovieList((prev) => [...prev, newMovie])
    reset()
  }

  return (
    <div>
      <h2 className="text-4xl font-bold mb-10">Add a new movie</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
        <input
          {...register("title", {
            required: {
              message: "Title is required",
              value: true,
            },
          })}
          type="text"
          placeholder="Movie title"
          className="block"
        />
        {errors.title?.message && (
          <p className="text-red-500">{String(errors.title.message)}</p>
        )}
    </div>
    <div>
        <input
          {...register("genre", {
            required: {
              message: "Genre is required",
              value: true,
            },
          })}
          type="text"
          placeholder="Movie genre"
          className="block"
        />
        {errors.genre?.message && (
          <p className="text-red-500">{String(errors.genre.message)}</p>
        )}
    </div>

        <button
          type="submit"
          className="bg-red-400 px-3 py-2 rounded mb-5 text-white"
        >
          Add film
        </button>
      </form>
    </div>
  )
}
