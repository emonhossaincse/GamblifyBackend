
const GameList = require('../models/GameListModel');
const userData = require('../routers/UserData');

const seedUser = async (req, res, next) => {
    try {
        await GameList.deleteMany({});

        const users = await GameList.insertMany(userData);
        return res.status(201).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {seedUser};
