const Room = require("../models/room");
const { nanoid } = require("nanoid");

// Create a new room
const createRoom = async (req, res) => {
  try {
    const roomId = nanoid(10);
    const room = new Room({ roomId, code: "// Start coding..." });
    await room.save();
    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get room details
const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error("Error fetching room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update room code
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

module.exports = { createRoom, getRoom, updateCode };
