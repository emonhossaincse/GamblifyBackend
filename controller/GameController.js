const { validationResult } = require('express-validator');

const GameController = {
    run: async (req, res) => {
        try {
            // Accessing data from request body
            const { game_id, lang, play_for_fun, home_url } = req.body;

            // Log the request data
            console.log('Request Data:', req.body);
            
            // You can also send the request data back in the response
            res.status(200).json({
                status: true,
                message: 'Request data received successfully',
                data: req.body
            });
            
            // Validate and process the data here
            
        } catch (error) {
            // Handle errors
            console.error('Error in GameController.run:', error);
            res.status(500).json({ status: false, message: 'Internal Server Error' });
        }
    }
};

module.exports = GameController;
