import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function UploadVideo() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !videoFile || !thumbnail) {
      alert("Please fill all fields and select files");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    try {
      setLoading(true);
      console.log("Uploading video with data:", { title, description });
      const res = await axiosInstance.post("/videos/publishvideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Upload response:", res.data);
      alert("Video uploaded successfully!");
      navigate(`/watch/${res.data.data._id}`);
    } catch (err) {
      console.error("Upload failed", err);
      console.error("Upload error details:", err.response?.data);
      alert("Video upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Upload a Video</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium bg-pink-200">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium bg-pink-200">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 border border-gray-600"
            rows={4}
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium to-blue-800 ">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="text-gray-200"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium to-blue-300">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="text-gray-200"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Publish Video"}
        </button>
      </form>
    </div>
  );
}
