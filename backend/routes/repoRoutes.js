const express = require("express");
const router = express.Router();

const {
  createRepo,
  getUserRepo,
  deleteRepo,
  addNodeToRepo,
  deleteNodeFromRepo,
  updateNodeInRepo,
  moveNodeInRepo,
} = require("../controllers/repoController");

const { authMiddleware } = require("../Middlewares/authMiddleware");

router.post("/create", authMiddleware, createRepo);
router.get("/", authMiddleware, getUserRepo);
router.delete("/:repoId", authMiddleware, deleteRepo);

router.post("/:repoId/add-node", authMiddleware, addNodeToRepo);
router.post("/:repoId/delete-node", authMiddleware, deleteNodeFromRepo);
router.patch("/:repoId/update-node", authMiddleware, updateNodeInRepo);
router.post("/:repoId/move-node", authMiddleware, moveNodeInRepo);

module.exports = router;
