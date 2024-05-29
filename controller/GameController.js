const { validationResult } = require('express-validator');
const BogApiService = require('../services/BogApiService');
const User = require('../models/UserModel'); // Import the User model

const GameController = {
    run: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const message = errors.array()[0].msg;
                return res.status(400).json({ status: false, message });
            }

            // Retrieve user from the database using the username from the request
            const username = req.body.username; // Assume the username is sent in the request body
            const user = await User.findOne({ username });

            if (!user) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }

            const response = await BogApiService.getGameDirect(
                req.body.game_id,
                req.body.lang,
                req.body.play_for_fun,
                req.body.home_url,
                req // Pass the req object to getGameDirect
            );

            res.json({
                status: true,
                message: 'Game Details',
                response
            });
        } catch (error) {
            console.error('Error in GameController.run:', error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = GameController;
