import { Link } from "react-router-dom"


export default function Header(){
    return(
            <nav className=" min-h-18 border-b border-white/10 px-3 py-4 flex items-center justify-between bg-black">
                <div>
                    <img src="/" alt="retrte" />
                </div>
                <div className="flex gap-4">
                    <div className="">
                    <Link to="/about" style={{ textDecoration: "none" }}> <div className="">Movie</div></Link>
                    </div>
                    <div className="">Movie</div>
                    <div className="">Profile</div>
                    <div className="">About</div>
                    <div className="">Message</div>
                </div>
            </nav>
    )
}