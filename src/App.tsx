import { MOVIES } from "./data.film"
import { useState } from "react";
import { twMerge } from 'tailwind-merge';
import "tailwindcss";

export default function Movies() {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedGenre, setSelectGenre] = useState('');
  const [selectTeam ,setSelectTeam] = useState('');

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
        />

        <div className="flex items-center gap-3 mb-6">
          {genres.map(genre => 
            <button
              className={twMerge('px-3 py-1 rounded text-white bg-zinc-900',
              selectedGenre == genre ? 'bg-purple-600' : 'bg-zinc-900'
              )}
              key={genre}
              onClick ={() => setSelectGenre(selectedGenre == genre ? '' : genre)}
            >
              {genre}
            </button>
            )}
        </div>
        <ul className="space-y-2 ">
          {filtredMovies.length ? filtredMovies.map(movie => <li key={movie.id} className='fade'>
            {movie.title}({movie.genre})
            </li>) : (<li>No movie</li>)
          }
        </ul>
      </div>
    </>
  )
}


