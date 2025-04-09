const Repo = require("../models/Repo");

// 🔧 Add node (file/folder)
function addNode(tree, path, newNode) {
  if (path.length === 0) {
    const exists = tree.find((n) => n.name === newNode.name);
    if (exists) throw new Error("Node with same name already exists in this folder");
    tree.push(newNode);
    return;
  }

  const currentFolder = tree.find(
    (node) => node.type === "folder" && node.name === path[0]
  );

  if (!currentFolder) throw new Error(`Folder "${path[0]}" not found in path`);

  addNode(currentFolder.children, path.slice(1), newNode);
}

// 🔧 Delete node by path
function deleteNode(tree, path) {
  if (!path.length) return tree;

  const [current, ...rest] = path;
  const index = tree.findIndex((node) => node.name === current);

  if (index === -1) return tree;

  if (rest.length === 0) {
    tree.splice(index, 1);
  } else {
    const currentNode = tree[index];
    if (currentNode.type === "folder") {
      currentNode.children = deleteNode(currentNode.children || [], rest);
    }
  }

  return tree;
}

// 🔧 Update node (rename or content)
function updateNode(tree, path, updates) {
  if (!path.length) return;

  const [current, ...rest] = path;
  const node = tree.find((n) => n.name === current);
  if (!node) return;

  if (rest.length === 0) {
    Object.assign(node, updates);
  } else if (node.type === "folder") {
    updateNode(node.children || [], rest, updates);
  }
}

// 🔧 Move node from one path to another
function getNodeAndRemove(tree, path) {
  if (!path.length) return [null, tree];

  const [current, ...rest] = path;
  const index = tree.findIndex((n) => n.name === current);
  if (index === -1) return [null, tree];

  if (rest.length === 0) {
    const [removed] = tree.splice(index, 1);
    return [removed, tree];
  }

  const currentNode = tree[index];
  if (currentNode.type === "folder") {
    return getNodeAndRemove(currentNode.children || [], rest);
  }

  return [null, tree];
}

// 🚀 Create repo
const createRepo = async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) return res.status(400).json({ message: "Name and userId required" });

    const repo = new Repo({ name, userId, structure: [] });
    await repo.save();
    res.status(201).json({ message: "Repo created", repo });
  } catch (error) {
    console.error("Error creating repo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📂 Get user repos
const getUserRepo = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const repos = await Repo.find({ userId });
    res.status(200).json(repos);
  } catch (error) {
    console.error("Fetch repos error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ❌ Delete repo
const deleteRepo = async (req, res) => {
  try {
    const { repoId } = req.params;
    const repo = await Repo.findByIdAndDelete(repoId);
    if (!repo) return res.status(404).json({ message: "Repo not found" });

    res.status(200).json({ message: "Repo deleted" });
  } catch (error) {
    console.error("Delete repo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ➕ Add node
const addNodeToRepo = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { path, node } = req.body;

    const repo = await Repo.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repo not found" });

    addNode(repo.structure, path, node);
    await repo.save();

    res.status(200).json({ message: "Node added", structure: repo.structure });
  } catch (error) {
    console.error("Add node error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// 🗑️ Delete node
const deleteNodeFromRepo = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { path } = req.body;

    if (!Array.isArray(path)) return res.status(400).json({ message: "Path must be array" });

    const repo = await Repo.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repo not found" });

    deleteNode(repo.structure, path);
    await repo.save();

    res.status(200).json({ message: "Node deleted", structure: repo.structure });
  } catch (error) {
    console.error("Delete node error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// ✏️ Update node (rename or content)
const updateNodeInRepo = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { path, updates } = req.body;

    const repo = await Repo.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repo not found" });

    updateNode(repo.structure, path, updates);
    await repo.save();

    res.status(200).json({ message: "Node updated", structure: repo.structure });
  } catch (error) {
    console.error("Update node error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

// 🔀 Move node
const moveNodeInRepo = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { fromPath, toPath } = req.body;

    const repo = await Repo.findById(repoId);
    if (!repo) return res.status(404).json({ message: "Repo not found" });

    const [movedNode] = getNodeAndRemove(repo.structure, fromPath);
    if (!movedNode) return res.status(400).json({ message: "Node to move not found" });

    addNode(repo.structure, toPath, movedNode);
    await repo.save();

    res.status(200).json({ message: "Node moved", structure: repo.structure });
  } catch (error) {
    console.error("Move node error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createRepo,
  getUserRepo,
  deleteRepo,
  addNodeToRepo,
  deleteNodeFromRepo,
  updateNodeInRepo,
  moveNodeInRepo,
};
