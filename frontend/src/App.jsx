import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Register from "./pages/register";
import Login from "./pages/Login";
import Home from "./pages/Home"; // Coming soon
import Profile from "./pages/Profile"; 
import WatchHistory from "./pages/WatchHistory";
import Watch from "./pages/watch";
import { useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute"; 
import UploadVideo from "./pages/UploadVideo";
import TestCleanup from "./pages/TestCleanup";
import TestDebug from "./pages/TestDebug";



function App() {
  const { authUser } = useAuth(); 
  return (
    
      <Routes>
         <Route path="/" element={<Layout key={authUser ? "logged-in" : "guest"} />}>
           <Route index element={<Home />} />
           
             {/*  Protect profile & history */}
             <Route path="/profile" element={
               <PrivateRoute>
                 <Profile />
               </PrivateRoute>
             } />
             <Route path="/channel/:username" element={
               <PrivateRoute>
                 <Profile />
               </PrivateRoute>
             } />
             <Route path="/history" element={
              <PrivateRoute>
                <WatchHistory />
              </PrivateRoute>
            } />

          </Route>

        <Route path="/upload" element={<UploadVideo />} />
        <Route path="/watch/:videoId" element={<Watch />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test-cleanup" element={<TestCleanup />} />
        <Route path="/test-debug" element={<TestDebug />} />
      </Routes>
  
  );
}

export default App;


