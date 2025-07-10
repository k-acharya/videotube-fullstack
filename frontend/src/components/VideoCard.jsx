import React from "react";
import { Link } from "react-router-dom";

function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video._id}`}>
      <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
        <img src={video.thumbnail} alt={video.title} className="w-full" />
        <div className="p-2">
          <h3 className="text-white text-lg font-semibold truncate">
            {video.title}
          </h3>
          <p className="text-sm text-gray-400">{video.owner.username}</p>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;


