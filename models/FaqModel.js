const mongoose = require('mongoose');

// Define the schema for the Game model
const faqSchema = new mongoose.Schema({
    faqQuestion: { type: String},
    faqAnswer: { type: String },
    status: { type: String, enum: ['active', 'inactive'], required: true }
});

// Create the Game model based on the schema
const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;
