const Room = require("../models/room");
const Repo = require("../models/Repo");
const { nanoid } = require("nanoid");

// Create a new room and link to a repo
const createRoom = async (req, res) => {
  try {
    const { repoId, userId } = req.body;

    if (!repoId || !userId) {
      return res.status(400).json({ message: "repoId and userId are required" });
    }

    const repo = await Repo.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    const roomId = nanoid(10);
    const room = new Room({
      roomId,
      repoId,
      users: [{ userId }],
      code: "// Start coding...",
    });

    await room.save();
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get room details (including repo)
const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId }).populate("repoId");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Join an existing room
const joinRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const alreadyInRoom = room.users.some((u) => u.userId === userId);
    if (!alreadyInRoom) {
      room.users.push({ userId });
      await room.save();
    }

    res.status(200).json({ message: "Joined room", room });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Optional: update code for backward compatibility
const updateCode = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { code } = req.body;

    const room = await Room.findOneAndUpdate({ roomId }, { code }, { new: true });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Code updated successfully", room });
  } catch (error) {
    console.error("Error updating code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createRoom,
  getRoom,
  joinRoom,
  updateCode,
};
