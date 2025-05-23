const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    users: [{ userId: { type: String, required: true } }],
    repoId: { type: mongoose.Schema.Types.ObjectId, ref: "Repo", required: true },
    code: { type: String, default: "// Start coding..." },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
