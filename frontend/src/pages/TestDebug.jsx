import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../utils/axiosInstance";

export default function TestDebug() {
  const { authUser } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Check authentication
      results.auth = {
        user: authUser,
        isLoggedIn: !!authUser,
        timestamp: new Date().toISOString()
      };

      // Test 2: Check if we can fetch videos
      try {
        const videosRes = await axiosInstance.get("/videos/publishvideo");
        results.videos = {
          success: true,
          count: videosRes.data.data?.length || 0,
          firstVideo: videosRes.data.data?.[0] || null
        };
      } catch (err) {
        results.videos = {
          success: false,
          error: err.message,
          details: err.response?.data
        };
      }

      // Test 3: Check if we can fetch liked videos (if logged in)
      if (authUser) {
        try {
          const likesRes = await axiosInstance.get("/likes/videos");
          results.likes = {
            success: true,
            count: likesRes.data.data?.length || 0,
            data: likesRes.data.data
          };
        } catch (err) {
          results.likes = {
            success: false,
            error: err.message,
            details: err.response?.data
          };
        }
      } else {
        results.likes = { skipped: "User not logged in" };
      }

      // Test 4: Check if we can fetch comments for a video (if we have one)
      if (results.videos?.firstVideo?._id) {
        try {
          const commentsRes = await axiosInstance.get(`/comments/video/${results.videos.firstVideo._id}`);
          results.comments = {
            success: true,
            count: commentsRes.data.data?.length || 0,
            data: commentsRes.data.data
          };
        } catch (err) {
          results.comments = {
            success: false,
            error: err.message,
            details: err.response?.data
          };
        }
      } else {
        results.comments = { skipped: "No videos available" };
      }

      // Test 5: Check current user endpoint
      if (authUser) {
        try {
          const userRes = await axiosInstance.get("/users/current-user");
          results.currentUser = {
            success: true,
            data: userRes.data.data
          };
        } catch (err) {
          results.currentUser = {
            success: false,
            error: err.message,
            details: err.response?.data
          };
        }
      } else {
        results.currentUser = { skipped: "User not logged in" };
      }

    } catch (err) {
      results.generalError = {
        error: err.message,
        details: err.response?.data
      };
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Debug Tests</h1>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 mb-4"
      >
        {loading ? "Running Tests..." : "Run Debug Tests"}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          {Object.entries(testResults).map(([testName, result]) => (
            <div key={testName} className="bg-gray-800 p-4 rounded">
              <h2 className="font-bold text-lg mb-2">{testName.toUpperCase()}</h2>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 