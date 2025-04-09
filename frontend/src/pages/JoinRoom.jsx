import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "../components/Sidebar";

const API_URL = "http://localhost:5000/api/";

export default function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Check if user is authenticated
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else navigate("/login");
    });
    return () => unsubscribe();
  }, []);

  const handleJoin = async () => {
    if (!roomId.trim()) {
      setError("Room ID cannot be empty.");
      return;
    }

    try {
      const res = await axios.get(`${API_URL}rooms/${roomId}`);
      if (res.data) {
        navigate(`/editor/${roomId}`); // ✅ UPDATED PATH
      }
    } catch (err) {
      console.error("Error joining room:", err?.response?.data || err.message);
      setError("Room not found. Please check the ID.");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-700 via-indigo-500 to-purple-600">
      {isSidebarOpen && <Sidebar user={user} />}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Join a Room</h1>
        <p className="text-lg mb-6">
          Enter the room code to collaborate in real-time.
        </p>

        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full max-w-md px-4 py-3 text-black rounded-lg mb-4 outline-none focus:ring-2 ring-white shadow"
        />

        {error && <p className="text-red-300 mb-3">{error}</p>}

        <button
          onClick={handleJoin}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg shadow"
        >
          Join Room 🚪
        </button>
      </div>
    </div>
  );
}
