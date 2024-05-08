require('dotenv').config();
const serverPort = process.env.SERVER_PORT;
const mongoDBURL = process.env.MONGODB_ATLAS_URL;

module.exports = { serverPort, mongoDBURL };
