const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["file", "folder"], required: true },
  content: { type: String }, // Only for files
  children: { type: [mongoose.Schema.Types.Mixed], default: [] }, // For folders
}, { _id: false });

const repoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    structure: [nodeSchema], // Top-level nodes
  },
  { timestamps: true }
);

const Repo = mongoose.model("Repo", repoSchema);
module.exports = Repo;
