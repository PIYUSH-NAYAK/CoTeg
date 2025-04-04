const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    files: [{ name: String, content: String }], // List of files inside the repository
  },
  { timestamps: true }
);

const Repo = mongoose.model("Repo", repoSchema);
module.exports = Repo;
