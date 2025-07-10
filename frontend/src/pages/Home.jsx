import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import VideoCard from "../components/VideoCard";

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
    <div className="p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Trending Videos</h1>

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

