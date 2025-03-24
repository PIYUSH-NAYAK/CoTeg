import { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log(' Connected to server:', socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="text-4xl text-center mt-10 text-green-500">
      Coteg Connected to Backend 🎉
    </div>
  );
}

export default App;
