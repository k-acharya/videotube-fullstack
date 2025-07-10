//  IMPORT useAuth hook from context
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function Header() {
  const { authUser, setAuthUser } = useAuth(); // use context
  console.log("Header rendered — authUser:", authUser);
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
      <Link to="/" className="text-xl font-bold text-green-400">
        VideoTube
      </Link>

      <nav className="flex items-center gap-4">
        
        {authUser ? (
          <>
            <Link to="/history" className="hover:text-green-300">History</Link>
            <Link to={`/channel/${authUser.username}`} className="hover:text-green-300">
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
