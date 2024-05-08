const mongoose = require('mongoose');

// Define the schema for the Game model
const gamelistSchema = new mongoose.Schema({
    gameId: { type: String, required: true },
    gameName: { type: String, required: true },
    gameType: { type: String, enum: ['casino', 'sports', 'game', 'virtual sports', 'live casino'], required: true },
    status: { type: String, enum: ['active', 'inactive'], required: true }
});

// Create the Game model based on the schema
const GameList = mongoose.model('GameList', gamelistSchema);

module.exports = GameList;
