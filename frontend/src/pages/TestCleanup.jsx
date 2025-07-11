import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function TestCleanup() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusResult, setStatusResult] = useState(null);

  const cleanupLikes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/likes/cleanup");
      setResult(res.data);
      console.log("Cleanup result:", res.data);
    } catch (err) {
      console.error("Cleanup failed:", err);
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    try {
      const res = await axiosInstance.get("/likes/status");
      setStatusResult(res.data);
      console.log("Status result:", res.data);
    } catch (err) {
      console.error("Status check failed:", err);
      setStatusResult({ error: err.message });
    }
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Like Cleanup Test</h1>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={checkStatus}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Check Likes Status
        </button>
        
        <button
          onClick={cleanupLikes}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Cleaning..." : "Clean Up Duplicate Likes"}
        </button>
      </div>
      
      {statusResult && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h2 className="font-bold">Status:</h2>
          <pre className="text-sm">{JSON.stringify(statusResult, null, 2)}</pre>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h2 className="font-bold">Cleanup Result:</h2>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 