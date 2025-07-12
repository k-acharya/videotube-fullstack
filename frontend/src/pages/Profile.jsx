import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subStatusChecked, setSubStatusChecked] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user profile...");
        
        if (username) {

          // Fetch other user's channel profile
          const res = await axiosInstance.get(`/users/c/${username}`);
          console.log("Channel data:", res.data.data);
          setUser(res.data.data);
          
          // Fetch videos by this user
          const videoRes = await axiosInstance.get(
            `/videos/publishvideo?userId=${res.data.data._id}`
          );
          console.log("Channel videos:", videoRes.data.data);
          setVideos(videoRes.data.data);

           // Check subscription status
           try {
             const subRes = await axiosInstance.get(`/subscriptions/status/${res.data.data._id}`);
             setIsSubscribed(subRes.data.data.isSubscribed); // boolean
           } catch (err) {
             console.error("Error checking subscription status:", err);
           } finally {
             setSubStatusChecked(true);
           }

        } else {
          // Fetch current user's profile
          const res = await axiosInstance.get("/users/current-user");
          console.log("User data:", res.data.data);
          setUser(res.data.data);

          // Fetch uploaded videos by user
          const videoRes = await axiosInstance.get(
            `/videos/publishvideo?userId=${res.data.data._id}`
          );
          console.log("User videos:", videoRes.data.data);
          setVideos(videoRes.data.data);
        }

      } catch (err) {
        console.error("Error loading profile", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (error) return <p className="text-red-400 p-4">Error: {error}</p>;
  if (!user) return <p className="text-white p-4">User not found.</p>;

  const handleSubscribeToggle = async () => {
   try {
     await axiosInstance.post(`/subscriptions/toggle/${user._id}`);
     setIsSubscribed((prev) => !prev);
   } catch (err) {
     console.error("Failed to toggle subscription", err);
   }
  };

  return (
    <div className="p-4 text-white max-w-5xl mx-auto">
      {/* Cover Image */}
      <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
        <img
          src={user.coverImage || "/default-cover.jpg"}
          alt="cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Avatar & Username */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="avatar"
          className="w-20 h-20 rounded-full border-2 border-white"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.fullName}</h2>
          <p className="text-gray-400">@{user.username}</p>
          {username && user.subscribersCount !== undefined && (
            <p className="text-sm text-gray-400">
              {user.subscribersCount} subscribers
            </p>
          )}
        </div>
        {username && user.subscribersCount !== undefined && (
          <>
            <p className="text-sm text-gray-400">
              {user.subscribersCount} subscribers
            </p>
        
            {subStatusChecked && (
              <button
                onClick={handleSubscribeToggle}
                className={`mt-2 px-4 py-1 rounded ${
                  isSubscribed ? "bg-gray-600 text-white" : "bg-green-600 text-white"
                }`}
              >
                {isSubscribed ? "Subscribed " : "Subscribe"}
              </button>
            )}
          </>
        )}
      </div>

      {/* User's Videos */}
      <h3 className="text-xl font-semibold mb-4">
        {username ? `${user.fullName}'s Videos` : "Your Uploaded Videos"}
      </h3>
      {videos.length === 0 ? (
        <p className="text-gray-400">
          {username ? "No videos uploaded yet." : "No videos uploaded yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video._id} className="bg-gray-800 rounded-lg p-2">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full rounded mb-2"
              />
              <h4 className="font-semibold truncate">{video.title}</h4>
              <p className="text-sm text-gray-400">{video.views} views</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


