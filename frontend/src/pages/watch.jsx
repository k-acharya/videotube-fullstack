import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";

export default function Watch() {
  const { videoId } = useParams();
  const { authUser } = useAuth();
  const [video, setVideo] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    console.log("Watch component - Auth user:", authUser);
    console.log("Watch component - Video ID:", videoId);
    
    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get(`/videos/${videoId}`);
        console.log("Video data:", res.data.data);
        setVideo(res.data.data);
        setLikeCount(res.data.data.likesCount || 0);
        // Add to watch history if user is logged in
        if (authUser) {
          try {
            await axiosInstance.post(`/users/history/${videoId}`);
            console.log("Added to watch history");
          } catch (err) {
            console.error("Failed to add to watch history", err);
          }
        }
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchLikedVideos = async () => {
      try {
        console.log("Fetching liked videos...");
        const res = await axiosInstance.get(`/likes/videos`);
        console.log("Liked videos response:", res.data);
        const likedVideoIds = res.data.data.map((v) => v._id);
        console.log("Liked video IDs:", likedVideoIds);
        console.log("Current video ID:", videoId);
        setLiked(likedVideoIds.includes(videoId));
      } catch (err) {
        console.error("Error fetching liked videos:", err);
        console.error("Error details:", err.response?.data);
      }
    };

    const fetchComments = async () => {
      try {
        console.log("Fetching comments for video:", videoId);
        const res = await axiosInstance.get(`/comments/video/${videoId}`);
        console.log("Fetched comments:", res.data); 
        setComments(res.data.data || []);
      } catch (err) {
        console.error("Error fetching comments", err);
        console.error("Error details:", err.response?.data);
        setComments([]); // fallback to avoid .map error
      }
    };

    fetchVideo();
    if (authUser) {
      fetchComments();
      fetchLikedVideos();
    }
  }, [videoId, authUser]);

const handleLikeToggle = async () => {
  if (!authUser) {
    console.log("User not logged in, cannot like video");
    return;
  }
  
  try {
    console.log("Toggling like for video:", videoId);
    const res = await axiosInstance.post(`/likes/toggle/v/${videoId}`);
    console.log("Like toggle response:", res.data);
    
    // Refresh video data to get updated like count
    const videoRes = await axiosInstance.get(`/videos/${videoId}`);
    setVideo(videoRes.data.data);
    setLikeCount(videoRes.data.data.likesCount || 0);
    
    // Update liked state based on the response
    if (res.data.message === "Video liked") {
      setLiked(true);
    } else if (res.data.message === "Video unliked") {
      setLiked(false);
    }
  } catch (err) {
    console.error("Failed to toggle like", err);
    console.error("Error details:", err.response?.data);
  }
};

  const handleAddComment = async () => {
    if (!authUser) {
      console.log("User not logged in, cannot add comment");
      return;
    }
    
    if (!newComment.trim()) return;

    try {
      console.log("Adding comment:", newComment);
      const res = await axiosInstance.post(`/comments/video/${videoId}`, { content: newComment });
      console.log("Comment response:", res.data);
      setNewComment("");
      const commentsRes = await axiosInstance.get(`/comments/video/${videoId}`);
      setComments(commentsRes.data.data || []);
    } catch (err) {
      console.error("Failed to post comment", err);
      console.error("Error details:", err.response?.data);
    }
  };

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (!video) return <p className="text-white p-4">Video not found.</p>;

  return (
    <div className="flex flex-col lg:flex-row p-4 text-white gap-6 max-w-7xl mx-auto">
      {/* Main Video Section */}
      <div className="flex-1">
        <video controls className="w-full rounded-lg mb-4">
          <source src={video.videoFile} type="video/mp4" />
        </video>

        <h1 className="text-2xl font-bold">{video.title}</h1>
        <p className="text-gray-400 text-sm mb-2">{video.views} views</p>

        <div className="flex items-center gap-4 mb-4">
          <Link to={video.owner?.username ? `/channel/${video.owner.username}` : "#"} className="flex items-center gap-2">
            <img
              src={video.owner?.avatar || "/default-avatar.png"}
              alt="uploader"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{video.owner?.username}</span>
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-4">
          {authUser ? (
            <button
              onClick={handleLikeToggle}
              className={`px-4 py-1 rounded ${
                liked ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              {liked ? "Liked " : "Like "} ({likeCount})
            </button>
          ) : (
            <p className="text-gray-400">Login to like this video</p>
          )}
        </div>

        <div className="bg-gray-800 p-3 rounded-md">
          <p className="text-gray-300 whitespace-pre-wrap">
            {video.description}
          </p>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
        
          {/* Comment Input */}
          {authUser ? (
            <div className="mb-4">
               <textarea
                 value={newComment}
                 onChange={(e) => setNewComment(e.target.value)}
                 placeholder="Add a comment..."
                 className="w-full p-2 rounded text-black"
               />
               <button
                 onClick={handleAddComment}
                 className="mt-2 bg-blue-600 px-4 py-1 rounded text-white hover:bg-blue-700"
                >
                 Post
               </button>
            </div>
          ) : (
            <p className="text-gray-400 mb-4">Login to add a comment</p>
          )}
        
          {/* Comment List */}
          <div className="space-y-4">
            {!Array.isArray(comments) || comments.length === 0 ? (
              <p className="text-gray-400">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="bg-gray-800 p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={comment.owner?.avatar || "/default-avatar.png"}
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-semibold text-sm">{comment.owner?.username}</span>
                  </div>
                  <p className="text-sm text-white">{comment.content}</p>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

      {/* Related videos goes here */}
    </div>
  );
}
