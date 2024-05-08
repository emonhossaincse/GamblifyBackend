const mongoose = require('mongoose');

// Define the schema for the Logos model
const logosSchema = new mongoose.Schema({
    logo: { type: String }, // Storing the path to the logo image
    horizontalLogo: { type: String }, // Storing the path to the horizontal logo image
    favicon: { type: String } // Storing the path to the favicon image
});

// Create the Logos model based on the schema
const Logos = mongoose.model('Logos', logosSchema);

module.exports = Logos;