import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function Watch() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get(`/videos/${videoId}`);
        setVideo(res.data.data);
        setLikeCount(res.data.data.likesCount || 0);
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLikedVideos = async () => {
      try {
        const res = await axiosInstance.get(`/likes/videos`);
        const likedVideoIds = res.data.data.map((v) => v._id);
        setLiked(likedVideoIds.includes(videoId));
      } catch (err) {
        console.error("Error fetching liked videos:", err);
      }
    };

    fetchVideo();
    fetchLikedVideos();
  }, [videoId]);

  const handleLikeToggle = async () => {
    try {
      await axiosInstance.post(`/likes/toggle/v/${videoId}`);
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (!video) return <p className="text-white p-4">Video not found.</p>;

  return (
    <div className="flex flex-col lg:flex-row p-4 text-white gap-6 max-w-7xl mx-auto">
      {/* Main Video Section */}
      <div className="flex-1">
        <video controls className="w-full rounded-lg mb-4">
          <source src={video.videoFile?.url} type="video/mp4" />
        </video>

        <h1 className="text-2xl font-bold">{video.title}</h1>
        <p className="text-gray-400 text-sm mb-2">{video.views} views</p>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={video.owner?.avatar?.url}
            alt="uploader"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">{video.owner?.username}</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleLikeToggle}
            className={`px-4 py-1 rounded ${
              liked ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {liked ? "Liked 👍" : "Like 👍"} ({likeCount})
          </button>
        </div>

        <div className="bg-gray-800 p-3 rounded-md">
          <p className="text-gray-300 whitespace-pre-wrap">
            {video.description}
          </p>
        </div>
      </div>

      {/* Related videos goes here */}
    </div>
  );
}
