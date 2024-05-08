const express = require('express');
const { searchInJsonFile, createGame, updateGame, deleteGame, viewGames, viewGameById } = require('../controller/GameListController');
const GameRouter = express.Router();

GameRouter.get('/', (req, res) => {
  const { name, type } = req.query; 
  
  searchInJsonFile({ name, type }, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log("Number of results:", results.length); // Log the number of results
    res.json(results);
  });
});


  GameRouter.get('/games', viewGames);
  GameRouter.post('/games', createGame);
  GameRouter.put('/games/:id', updateGame);
  GameRouter.get('/games/:id', viewGameById);
  GameRouter.delete('/games/:id', deleteGame);

  module.exports = {GameRouter};