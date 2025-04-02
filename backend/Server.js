require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDb = require('./utils/db');
const roomRoutes = require('./routes/authRouter'); // ✅ Import routes

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rooms', roomRoutes); // ✅ Route prefix

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    },
});

io.on('connection', (socket) => {
    console.log("User Connected:", socket.id);

    // Handle joining a room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        // Notify others in the room
        socket.to(roomId).emit('userJoined', socket.id);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log("User Disconnected:", socket.id);
    });
});

// MongoDB Connection
connectDb().then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
