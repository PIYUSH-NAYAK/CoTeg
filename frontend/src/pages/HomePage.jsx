import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../auth";

const HomePage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [user] = useAuthState(auth);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome to Coteg</h1>
      {user && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 w-80 text-center">
          <p className="text-lg font-semibold">Hello, {user.displayName || "User"}!</p>
          <p className="text-sm text-gray-600">{user.email}</p>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <button
          onClick={createRoom}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full mb-4"
        >
          Create a Room
        </button>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-center"
        />
        <button
          onClick={joinRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default HomePage;