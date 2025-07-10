import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");


    if (!avatarFile) {
      setError("Please upload an avatar image.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", inputs.fullName);
    formData.append("username", inputs.username);
    formData.append("email", inputs.email);
    formData.append("password", inputs.password);
    formData.append("avatar", avatarFile); 
    if (coverFile) formData.append("coverImage", coverFile);

    try {
      const res = await axiosInstance.post("/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log(" User registered:", res.data);
      navigate("/");

    } catch (err) {
       console.error(" Register error:", err); 
       const message = err?.response?.data?.message || err?.message || "Registration failed";
       setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={inputs.username}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none"
            required
          />

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={inputs.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={inputs.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded bg-gray-700 focus:outline-none"
            required
          />

          <label className="block text-sm font-medium mb-1">Avatar Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />

          <label className="block text-sm font-medium mt-4 mb-1">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files[0])}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-green-600 py-2 rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
