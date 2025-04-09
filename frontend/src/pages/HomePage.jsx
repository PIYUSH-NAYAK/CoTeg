// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Make sure this path is correct

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserId(user.uid);
      } else {
        setUser(null);
        setUserId(null);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gradient-to-r from-purple-700 via-indigo-500 to-blue-500">
      {isSidebarOpen && <Sidebar userId={userId} />}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Coteg</h1>
        {user && (
          <h2 className="text-xl mb-6">
            Hello, {user.displayName || "Coder"} 👋
          </h2>
        )}
        <p className="text-lg mb-10">
          Collaborate on your repositories in real-time with anyone, anywhere.
        </p>

        <div
          role="group"
          aria-label="Room actions"
          className="flex flex-col md:flex-row gap-6"
        >
          <button
            onClick={() => navigate("/create-room")}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg shadow"
          >
            Create Room 🚀
          </button>

          <button
            onClick={() => navigate("/join-room")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg shadow"
          >
            Join Room 🔑
          </button>
        </div>
      </div>
    </div>
  );
}
