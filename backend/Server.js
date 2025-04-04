require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDb = require("./utils/db");
const roomRouter = require("./routes/authRouter");
const repoRouter = require("./routes/repoRoutes"); // ✅ Import repo routes
const Room = require("./models/room");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/rooms", roomRouter);
app.use("/api/repos", repoRouter); // ✅ Add repo routes

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("joinRoom", async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    try {
      let room = await Room.findOne({ roomId });
      if (!room) {
        room = new Room({ roomId, code: "// Start coding..." });
        await room.save();
      }
      socket.emit("initialCode", room.code);
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  });

  socket.on("requestCode", async (roomId) => {
    try {
      const room = await Room.findOne({ roomId });
      if (room) {
        socket.emit("initialCode", room.code);
      }
    } catch (error) {
      console.error("Error fetching code:", error);
    }
  });

  socket.on("sendCode", async ({ roomId, code }) => {
    socket.to(roomId).emit("codeUpdate", code);

    try {
      await Room.findOneAndUpdate({ roomId }, { code }, { new: true });
    } catch (error) {
      console.error("Error updating code:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// MongoDB Connection
connectDb()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
