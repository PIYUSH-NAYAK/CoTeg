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
    <div>
      <h1>Welcome to Coteg</h1>
      <button onClick={createRoom}>Create a Room</button>
      <div>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default HomePage;
