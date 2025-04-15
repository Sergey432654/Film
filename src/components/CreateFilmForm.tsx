import { SubmitHandler,useForm} from "react-hook-form"
import { Dispatch,SetStateAction} from "react"
import { MOVIES } from "../data.film.tsx"
import Tmovies from "./data.film.tsx"
import "tailwindcss";


type TCreateMovieForm = Pick<Tmovies, 'title' | 'genre'>
interface Props {
    setMovieList: Dispatch<SetStateAction<Tmovies[]>>
}
export function  CreateFilmForm({setMovieList}:Props){
    const {register , handleSubmit, reset,formState:{errors} } =  useForm<TCreateMovieForm>({
        mode: "onChange",
    })
    const onSubmit : SubmitHandler<TCreateMovieForm> = (data) => {
        const newMovie : Tmovies = {
            id : MOVIES.length +1,
            ...data,
        }
        setMovieList((prev)=>[...prev , newMovie])
        reset();

    }
    return(
    <div>
       
        <h2>Add a new movie</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
        <input 
       {...register('title' ,{required:true})}
            type="text" 
            placholder = "Movie title"
            className = 'px-1000 py-4 rounded mb-6 '
        />
        {errors.title?.message && (
            <p className="text-red-400">{errors.title.message}</p>
        )}
        <input 
        {...register('genre' ,{required:true})}
            type="text" 
            placholder = "Movie genre"
        />
        {errors.genre?.message && (
        <p className="text-red-400">{errors.genre.message}</p>
        )}
        <button type="submit" className="px-3 py-1">
            Add film
        </button>

        </form>
      
    </div>

)}