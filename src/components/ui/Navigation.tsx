import {Link} from "@tanstack/react-router";

export default function Navigation(){
    return(
        <nav>
            <Link
                to="/"
                className="text-lime-400">Home</Link>
            <Link
                to="/adminUsers"
                className="text-lime-400">Admin Users</Link>

            <Link
            to="/Profile"
            className="text-lime-400">Profile</Link>
        </nav>
    )
}