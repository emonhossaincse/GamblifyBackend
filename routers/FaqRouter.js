const express = require('express');
const FaqController = require('../controller/FaqController');
const faqRouter = express.Router();


// Get all users
faqRouter.get('/', FaqController.getAllFaqs);

// Create a new user
faqRouter.post('/', FaqController.createFaq);

// View a user by ID
faqRouter.get('/:id', FaqController.getFaqById);

// Update a user by ID
faqRouter.put('/:id', FaqController.updateFaqById);

// Delete a user by ID
faqRouter.delete('/:id', FaqController.deleteFaqById);

module.exports = faqRouter;
