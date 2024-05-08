const express = require('express');
const GeneralController = require('../controller/GeneralController');
const generalRouter = express.Router();

// Route to view general settings
generalRouter.get('/', GeneralController.viewGeneralSettings);

// Route to create general settings
generalRouter.post('/', GeneralController.createGeneralSettings);

// Route to update general settings
generalRouter.put('/:id', GeneralController.updateGeneralSettings);
generalRouter.get('/:id', GeneralController.viewGeneralSettingsById);

module.exports = generalRouter;
