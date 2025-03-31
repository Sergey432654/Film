import { movies } from "./data.film"
export default function Movies() {
  return (
    <>
      <div>
        <h1>Movies</h1>
        <ul>
          {movies.map(movie => <li key={movie.id}>
            {movie.title}({movie.genre})
          </li>)}
        </ul>
      </div>
    </>
  )
}


