import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [roomId, setRoomId] = useState('');
  const [joinedRoom, setJoinedRoom] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('userJoined', (userId) => {
      console.log(`User ${userId} joined the room`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (roomId) {
      socket.emit('joinRoom', roomId);
      setJoinedRoom(roomId);
    }
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl text-green-500">Coteg - Real-time Collaboration</h1>
      
      {!joinedRoom ? (
        <div className="mt-5">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="border-2 border-gray-300 p-2 rounded"
          />
          <button onClick={joinRoom} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
            Join Room
          </button>
        </div>
      ) : (
        <h2 className="text-xl text-blue-600 mt-5">Joined Room: {joinedRoom}</h2>
      )}
    </div>
  );
}

export default App;
