const mongoose = require('mongoose');
const { mongoDBURL } = require('../secret');

const connectDB = async (options = {}) => {
    try {
        // Add connectTimeoutMS option to the options object
        const connectionOptions = { ...options, connectTimeoutMS: 60000 };
        
        await mongoose.connect(mongoDBURL, connectionOptions);
        console.log('Database Connection Successful');
        
        // Log connection options for debugging
        console.log('Connection Options:', connectionOptions);

        // Handle errors after the connection is established
        mongoose.connection.on('error', (error) => {
            console.error('Database Connection Error:', error);
        });
    } catch (error) {
        console.error('Database Connection Error:', error.toString());
    }
};

module.exports = { connectDB };
