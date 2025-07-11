import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";

const WatchHistory = () => {
  const { authUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      console.log("Fetching watch history...");
      const res = await axiosInstance.get("/users/history");
      console.log("Watch history response:", res.data);
      setHistory(res.data.data || []); // your backend sends videos in `data`
    } catch (error) {
      console.error("Failed to fetch watch history:", error);
      console.error("Error details:", error.response?.data);
      setError(error.message || "Failed to fetch watch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [authUser]);

  if (loading) {
    return <div className="text-center text-white mt-10">Loading history...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 mt-10">Error: {error}</div>;
  }

  if (!authUser) {
    return <div className="text-center text-gray-400 mt-10">Please log in to view your watch history.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-white">
      <h1 className="text-3xl font-semibold mb-6">Your Watch History</h1>

      {history.length === 0 ? (
        <p className="text-gray-400">You haven’t watched any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {history.map((video) => (
            <Link
              to={`/watch/${video._id}`}
              key={video._id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg"
            >
              <img
                src={video.thumbnail || "/default-thumbnail.jpg"}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h2 className="text-lg font-bold truncate">{video.title}</h2>
                <p className="text-sm text-gray-400 truncate">{video.owner?.username}</p>
                <p className="text-xs text-gray-500">{video.views} views</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
