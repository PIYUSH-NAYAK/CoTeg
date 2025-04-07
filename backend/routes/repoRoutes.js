const express = require("express");
const router = express.Router();
const {
  createRepo,
  getUserRepo,
  deleteRepo,
  addNodeToRepo,
  deleteNodeFromRepo, // ✅ Import deleteNodeFromRepo
} = require("../controllers/repoController");

const { authMiddleware } = require("../Middlewares/authMiddleware");

// 🚀 Routes for repositories
router.post("/create", authMiddleware, createRepo);
router.get("/", authMiddleware, getUserRepo);
router.delete("/:repoId", authMiddleware, deleteRepo);

// ✅ Route to add file/folder (node) into repo
router.post("/:repoId/add-node", authMiddleware, addNodeToRepo);

// 🗑️ Route to delete file/folder (node) from repo
router.post("/:repoId/delete-node", authMiddleware, deleteNodeFromRepo);

module.exports = router;
