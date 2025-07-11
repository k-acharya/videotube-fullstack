import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import VideoCard from "../components/VideoCard";
import { FaPlayCircle } from "react-icons/fa";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/videos/publishvideo"); // Assuming /videos returns all published
        setVideos(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="p-4 min-h-screen bg-teal-800">
      
      {/* Icon + Title */}
      <div className="flex items-center gap-2 mb-4">
        <FaPlayCircle size={28} color="white" />
        <h1 className="text-2xl font-serif text-white">Trending Videos</h1>
      </div>

      {videos.length === 0 ? (
        <p className="text-gray-400">No videos uploaded yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

