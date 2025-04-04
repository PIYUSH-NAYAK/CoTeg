import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userId="someUserId" />

      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Coteg</h1>
        <p className="mt-2 text-gray-700 text-lg max-w-md">
          Collaborate in real-time with developers across the world.
        </p>
        <button
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg shadow-md hover:bg-blue-600 transition"
          onClick={() => navigate("/home")}
        >
          Get Started 🚀
        </button>
      </div>
    </div>
  );
}
