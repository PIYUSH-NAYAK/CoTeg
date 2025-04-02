const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Room Routes
router.post('/create', roomController.createRoom);
router.get('/:roomId', roomController.getRoom);
router.put('/updateCode/:roomId', roomController.updateCode);

module.exports = router;
