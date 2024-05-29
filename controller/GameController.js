const { validationResult } = require('express-validator');
const BogApiService = require('../services/BogApiService');

const GameController = {
    run: async (req, res) => {
        try {
            // Log all request data
            console.log(req);
            
            // Accessing data from request body
            const { game_id, lang, play_for_fun, home_url } = req.body;
            
            // Validate and process the data here
            
        } catch (error) {
            // Handle errors
            console.error('Error in GameController.run:', error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    }
};


module.exports = GameController;
