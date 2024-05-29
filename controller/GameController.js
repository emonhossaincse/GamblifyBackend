const { validationResult } = require('express-validator');
const BogApiService = require('../services/BogApiService');

const GameController = {
    run: async (req, res) => {
        try {
            // Validation rules
            req.checkBody('game_id').notEmpty().isNumeric();
            req.checkBody('lang').notEmpty().isString();
            req.checkBody('play_for_fun').notEmpty().isBoolean();
            req.checkBody('home_url').notEmpty().isString();

            // Execute validation
            const errors = req.validationErrors();
            if (errors) {
                const message = errors[0].msg;
                return res.status(400).json({ status: false, message });
            }

            // Get user from authentication (if you have authentication middleware)
            const user = req.user;

            // Instantiate BogApiService
            const service = new BogApiService();

            // Call the getGameDirect method with the provided parameters
            const response = await service.getGameDirect(
                req.body.game_id,
                req.body.lang,
                req.body.play_for_fun,
                req.body.home_url,
                user
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
