// src/pages/HomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

const HomePage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    const newRoomId = nanoid(10);
    navigate(`/editor/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/editor/${roomId}`);
    } else {
      alert("Please enter a valid Room ID.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-600 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-400">Welcome to Coteg</h1>

        <div className="space-y-4">
          <button
            onClick={createRoom}
            className="w-full bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded-lg font-medium"
          >
            🚀 Create a Room
          </button>

          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg text-black text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={joinRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg font-medium"
          >
            👥 Join Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
