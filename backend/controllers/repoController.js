const Repo = require("../models/Repo");

// ✅ Create a new repository
const createRepo = async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ message: "Name and userId are required." });
    }

    const repo = new Repo({ name, userId, files: [] }); // 🔥 Changed Repository → Repo
    await repo.save();
    res.status(201).json({ message: "Repository created successfully", repo });
  } catch (error) {
    console.error("Error creating repository:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Fetch all repositories for a user
const getUserRepo = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "UserId is required." });
    }

    const repos = await Repo.find({ userId }); // 🔥 Changed Repository → Repo
    res.status(200).json(repos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete a repository
const deleteRepo = async (req, res) => {
  try {
    const { repoId } = req.params;

    const repo = await Repo.findByIdAndDelete(repoId); // 🔥 Changed Repository → Repo
    if (!repo) {
      return res.status(404).json({ message: "Repository not found." });
    }

    res.status(200).json({ message: "Repository deleted successfully." });
  } catch (error) {
    console.error("Error deleting repository:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createRepo, getUserRepo, deleteRepo };
