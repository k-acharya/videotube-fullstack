import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true); //  NEW

  const fetchCurrentUser = async () => {
    try {
      const res = await axiosInstance.get("/users/current-user");
      console.log("Fetched user in context:", res.data.data);  // DEBUG
      setAuthUser(res.data.data);
      
    } catch (err) {
      console.log("No user in context");  //  DEBUG
      setAuthUser(null);
    } finally {
      setLoading(false); //  NEW
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

    //  Don't render children until user state is fetched
  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

