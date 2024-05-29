const { validationResult } = require('express-validator');
const BogApiService = require('../services/BogApiService');

const GameController = {
    run: async (req, res) => {
        try {
            // Validation rules
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const message = errors.array()[0].msg;
                return res.status(400).json({ status: false, message });
            }

            // Get user from authentication (if you have authentication middleware)
            

            // Instantiate BogApiService
            const service = new BogApiService();

            // Call the getGameDirect method with the provided parameters
            const response = await service.getGameDirect(
                req.body.game_id,
                req.body.lang,
                req.body.play_for_fun,
                req.body.home_url,
                
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
