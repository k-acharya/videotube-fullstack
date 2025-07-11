import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { authUser } = useAuth();

  return authUser ? children : <Navigate to="/login" />;
}
