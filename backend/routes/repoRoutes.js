const express = require("express");
const router = express.Router();
const { createRepo, getUserRepo, deleteRepo } = require("../controllers/repoController"); // ✅ Correct import
const {authMiddleware} = require("../Middlewares/authMiddleware"); // ✅ Correct import

// Routes for repositories
router.post("/create", authMiddleware, createRepo);
router.get("/", authMiddleware, getUserRepo);
router.delete("/:repoId", authMiddleware, deleteRepo);

module.exports = router;
