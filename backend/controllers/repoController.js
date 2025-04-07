const Repo = require("../models/Repo");

// 🔧 Helper: Add node at nested path
function addNode(tree, path, newNode) {
  if (path.length === 0) {
    tree.push(newNode);
    return;
  }

  const currentFolder = tree.find(
    (node) => node.type === "folder" && node.name === path[0]
  );

  if (!currentFolder) throw new Error(`Folder "${path[0]}" not found in path`);

  addNode(currentFolder.children, path.slice(1), newNode);
}

// 🔧 Helper: Delete node at nested path
function deleteNode(tree, path) {
  if (!path.length) return tree;

  const [current, ...rest] = path;
  const index = tree.findIndex((node) => node.name === current);

  if (index === -1) return tree;

  if (rest.length === 0) {
    // Delete the node at this level
    tree.splice(index, 1);
  } else {
    const currentNode = tree[index];
    if (currentNode.type === "folder") {
      currentNode.children = deleteNode(currentNode.children || [], rest);
    }
  }

  return tree;
}

// 🚀 Create a new repository
const createRepo = async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ message: "Name and userId are required." });
    }

    const repo = new Repo({ name, userId, structure: [] });
    await repo.save();
    res.status(201).json({ message: "Repository created successfully", repo });
  } catch (error) {
    console.error("Error creating repository:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📂 Fetch all repositories for a user
const getUserRepo = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "UserId is required." });
    }

    const repos = await Repo.find({ userId });
    res.status(200).json(repos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ❌ Delete a repository
const deleteRepo = async (req, res) => {
  try {
    const { repoId } = req.params;

    const repo = await Repo.findByIdAndDelete(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found." });
    }

    res.status(200).json({ message: "Repository deleted successfully." });
  } catch (error) {
    console.error("Error deleting repository:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ➕ Add a file or folder to a repo
const addNodeToRepo = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { path, node } = req.body;

    const repo = await Repo.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found." });
    }

    addNode(repo.structure, path, node);
    await repo.save();

    res.status(200).json({ message: "Node added successfully", structure: repo.structure });
  } catch (error) {
    console.error("Error adding node to repo:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// 🗑️ Delete a file or folder from repo
const deleteNodeFromRepo = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { path } = req.body; // e.g., ["src", "App.js"]

    if (!Array.isArray(path)) {
      return res.status(400).json({ message: "Path must be an array." });
    }

    const repo = await Repo.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repository not found." });

    deleteNode(repo.structure, path);
    await repo.save();

    res.status(200).json({ message: "Node deleted successfully", structure: repo.structure });
  } catch (error) {
    console.error("Error deleting node:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createRepo,
  getUserRepo,
  deleteRepo,
  addNodeToRepo,
  deleteNodeFromRepo,
};
