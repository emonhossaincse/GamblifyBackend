const express = require('express');
const walletrouter = express.Router();
const WalletController = require('../controller/WalletController');
const { body } = require('express-validator');

// Define route for handling wallet requests
walletrouter.get('/', WalletController.handleRequest);

module.exports = walletrouter;
