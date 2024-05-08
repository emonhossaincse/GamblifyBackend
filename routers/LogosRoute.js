const express = require('express');
const logosController = require('../controller/logosController');

const logosRoute = express.Router();

logosRoute.get('/', logosController.getAllLogos);


logosRoute.post('/', logosController.upload, logosController.createLogo);

// Route for updating logo by ID
logosRoute.put('/:id', logosController.upload, logosController.updateLogoById);

module.exports = logosRoute;