import { MOVIES } from "./data.film"
import { useState } from "react";
import "tailwindcss";

export default function Movies() {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedGenre, setSelectGenre] = useState('');

  const genres = Array.from(new Set(MOVIES.map(movie => movie.genre)))

  const filtredMovies = MOVIES.filter(movie =>{
    const isMachingSearchTerm = movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    const isMachingGanre = selectedGenre ? movie.genre == selectedGenre : true

    return isMachingSearchTerm && isMachingGanre
})
  return (
    <>

      <div>
        <h1 className='text-6px font-bold mb-10'>Movies</h1>

        <input 
        type="text" 
        placholder = "frewfwer"
        value = {searchTerm}
        onChange = {e => setSearchTerm(e.target.value)}
        className='px-3 py-2 rounded mb-6 text-white outline-none border border-solid border-transparent focus: border-purple-500 transition-colors'
        />

        <div>
          {genres.map(genre => 
            <button
              key={genre}
              onClick ={() => setSelectGenre(selectedGenre == genre ? '' : genre)}
            >
              {genre}
            </button>
            )}
        </div>
        <ul>
          {filtredMovies.length ? filtredMovies.map(movie => <li key={movie.id}>
            {movie.title}({movie.genre})
            </li>) : (<li>No movie</li>)
          }
        </ul>
      </div>
    </>
  )
}


