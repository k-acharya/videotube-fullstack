//  IMPORT useAuth hook from context
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function Header() {
  const { authUser, setAuthUser } = useAuth(); // use context
  console.log("Header rendered — authUser:", authUser);
  console.log("Header rendered — authUser type:", typeof authUser);
  console.log("Header rendered — authUser keys:", authUser ? Object.keys(authUser) : "null");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/users/logout");
      setAuthUser(null); // reset context
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 shadow">
      <Link to="/" className="text-xl from-neutral-400 text-stone-200">
        VideoTube
      </Link>

      <nav className="flex items-center gap-4">
        
        {authUser ? (
          <>
            <Link to="/upload" className="hover:text-green-300">Upload</Link>
            <Link to="/history" className="hover:text-green-300">History</Link>
            <Link to="/profile" className="hover:text-green-300">
              {authUser.fullName}
            </Link>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-green-300">Login</Link>
            <Link to="/register" className="hover:text-green-300">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
