import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(`/users/c/${username}`);
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, [username]);

  if (!profile) return <p className="text-white p-4">Loading profile...</p>;

  return (
    <div className="text-white p-4">
      <h2 className="text-2xl font-bold mb-2">@{profile.username}</h2>
      <p className="text-gray-400 mb-2">{profile.fullName}</p>
      <img src={profile.avatar?.url} alt="Avatar" className="w-32 h-32 rounded-full" />
      <img src={profile.coverImage?.url} alt="Cover" className="w-full mt-4 rounded" />
    </div>
  );
}

