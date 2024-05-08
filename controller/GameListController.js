const fs = require('fs');
const datasource = require('../data/GameList.json');
const GameList = require('../models/GameListModel');

function searchInJsonFile({ name, type, page = 1, limit = 10 }, callback) {
    const jsonData = datasource; // Directly use the JSON data

    // Filter games based on the search criteria
    let filteredGames = jsonData.response.filter(game => {
        const matchesName = name ? game.name.toLowerCase().includes(name.toLowerCase()) : true;
        const matchesType = type ? game.type === type : true;
        return matchesName && matchesType;
    });

    // Implement pagination
    const startIndex = (page - 1) * limit; // Calculate the start index
    const endIndex = startIndex + limit; // Calculate the end index

    filteredGames = filteredGames.slice(startIndex, endIndex);

    callback(null, filteredGames);
}


const viewGames = async (req, res) => {
    try {
        const games = await GameList.find({});
        res.json({ success: true, games });
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const viewGameById = async (req, res) => {
    try {
        const game = await GameList.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }
        res.json({ success: true, game });
    } catch (error) {
        console.error('Error fetching game:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
const createGame = async (req, res) => {
    try {
        const { gameId, gameName, gameType, status } = req.body;
        const newGame = new GameList({ gameId, gameName, gameType, status });
        await newGame.save();
        res.status(201).json({ success: true, message: 'Game created successfully', game: newGame });
    } catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
const updateGame = async (req, res) => {
    const { gameId, gameName, gameType, status } = req.body;
    try {
        const updatedGame = await GameList.findByIdAndUpdate(req.params.id, { gameId, gameName, gameType, status }, { new: true });
        if (!updatedGame) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }
        res.json({ success: true, message: 'Game updated successfully', game: updatedGame });
    } catch (error) {
        console.error('Error updating game:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const deleteGame = async (req, res) => {
    try {
        const deletedGame = await GameList.findByIdAndDelete(req.params.id);
        if (!deletedGame) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }
        res.json({ success: true, message: 'Game deleted successfully' });
    } catch (error) {
        console.error('Error deleting game:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};






module.exports = { searchInJsonFile, viewGameById, viewGames, createGame, updateGame, deleteGame };
