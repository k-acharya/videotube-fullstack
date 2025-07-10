import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Register from "./pages/register";
import Login from "./pages/Login";
import Home from "./pages/Home"; // Coming soon
import Profile from "./pages/Profile"; 
import History from "./pages/History"; // Coming soon
import Watch from "./pages/watch";
import { useAuth } from "./contexts/AuthContext";



function App() {
  const { authUser } = useAuth(); 
  return (
    
      <Routes>
        <Route path="/" element={<Layout key={authUser ? "logged-in" : "guest"} />}>
          <Route index element={<Home />} />
          <Route path="/channel/:username" element={<Profile />} />
          <Route path="/history" element={<History />} />
        </Route>
        
        <Route path="/watch/:videoId" element={<Watch />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
  
  );
}

export default App;


