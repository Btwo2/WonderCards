const express = require('express');
const { saveGameData, getGameHistory } = require('../controllers/memoryController');
const router = express.Router();

// Route to save game data
router.post('/save', saveGameData);

// Route to get game history for a specific user
router.get('/history/:userID', getGameHistory);

module.exports = router;
