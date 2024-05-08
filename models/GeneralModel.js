const mongoose = require('mongoose');

// Define the schema for the Game model
const generalSchema = new mongoose.Schema({
    siteTitle: { type: String},
    currency: { type: String },
    currencySymbol: { type: String },
    defaultLanguage: { type: String }
    
});

// Create the Game model based on the schema
const General = mongoose.model('General', generalSchema);

module.exports = General;
