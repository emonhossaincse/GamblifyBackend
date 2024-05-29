const { validationResult } = require('express-validator');
const BogApiService = require('../services/BogApiService');
const User = require('../models/UserModel');

const GameController = {
    run: async (req, res) => {
        try {
            // Validation rules
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const message = errors.array()[0].msg;
                return res.status(400).json({ status: false, message });
            }

            // Fetch the user token from the database using the username
            const username = req.body.username; // Assuming username is passed in the request body
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ status: false, message: 'User not found' });
            }

            const token = user.token;
            if (!token) {
                return res.status(400).json({ status: false, message: 'Token not available for the user' });
            }

            // Call the getGameDirect method of BogApiService
            const response = await BogApiService.getGameDirect(
                req.body.game_id,
                req.body.lang,
                req.body.play_for_fun,
                req.body.home_url,
                req,
                token // Pass the token directly instead of req object
            );

            // Send response
            res.json({
                status: true,
                message: 'Game Details',
                response
            });
        } catch (error) {
            // Handle errors
            console.error('Error in GameController.run:', error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = GameController;
