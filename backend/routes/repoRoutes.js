const express = require("express");
const router = express.Router();
const { createRepo, getUserRepo, deleteRepo } = require("../controllers/repoController"); // ✅ Correct import

// Routes for repositories
router.post("/create", createRepo); // ✅ Use correct function names
router.get("/", getUserRepo); // ✅ Use correct function names
router.delete("/:repoId", deleteRepo); // ✅ Use correct function names

module.exports = router;
