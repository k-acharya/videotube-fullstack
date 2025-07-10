import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
