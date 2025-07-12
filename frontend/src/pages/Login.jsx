import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext"; // ...

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setAuthUser, fetchCurrentUser } = useAuth();  //  fetch it here


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loginResponse = await axiosInstance.post("/users/login", { email, password });
      console.log("Login response:", loginResponse.data);
      
      // Set the user directly from login response
      if (loginResponse.data?.data?.user) {
        setAuthUser(loginResponse.data.data.user);
        console.log("User set in context:", loginResponse.data.data.user);
      } else {
        console.error("No user data in login response");
        // Fallback to fetching current user
        await fetchCurrentUser();
      }
      
      alert("Login successful!");
      navigate("/");

    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.message || "Login failed");
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-teal-500 p-8 rounded-xl shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Login to VideoTube</h2>

        {error && (
          <p className="bg-red-500 text-white text-sm p-2 rounded">{error}</p>
        )}

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-36 p-2 bg-red-600 hover:bg-red-700 rounded font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}

