import { Link } from "react-router-dom"


export default function Header(){
    return(
            <nav className=" min-h-18 border-b border-white/10 px-3 py-4 flex items-center justify-between bg-black">
                <div>
                    <img className="w-25 h-25" src="/src/pictures/bird.png" alt="retrte" />
                </div>
                <div className="flex gap-4">
                    <Link to='/movie'>Movie</Link>
                    <Link to='/PENIS'>Penis</Link>
                    <Link to='/Egor'>Egor</Link>
                    <Link to='/pupok'>Pupok</Link>
                </div>
            </nav>
    )
}