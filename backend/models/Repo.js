const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ["file", "folder"], required: true },
  content: String, // Only for files
  children: [this], // Only for folders (recursive schema)
}, { _id: false });

const repoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    structure: [nodeSchema], // Nested structure for files and folders
  },
  { timestamps: true }
);

const Repo = mongoose.model("Repo", repoSchema);
module.exports = Repo;
