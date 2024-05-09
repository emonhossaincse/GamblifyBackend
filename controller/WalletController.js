const User = require('../models/UserModel');
const Transaction = require('../models/TransactionModel');
const querystring = require('querystring');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

class WalletController {
  constructor() {
    this.baseUrl = process.env.API_BASE_URL;
    this.apiPassword = process.env.API_PASSWORD;
    this.apiLogin = process.env.API_LOGIN;
    this.salt = process.env.SALT;
    this.handleRequest = this.handleRequest.bind(this);
  }

  async handleRequest(req, res) {
    const action = req.query.action; // Extract action from query string
  
    switch (action) {
      case 'balance':
        return this.getBalance(req, res);
      case 'debit':
        return this.debit(req, res);
      case 'credit':
        return this.credit(req, res);
      case 'rollback':
        return this.rollback(req, res);
      default:
        return res.status(400).json({ status: '400', message: `Invalid action: ${action}` });
    }
  }
  

  async getBalance(req, res) {
    if (!this.checkRequestIntegrity(req)) {
      const reqdata = req.body;
      return res.status(403).json({ status: '403', message: `Request integrity check failed ${JSON.stringify(reqdata)}` });
  }
  

    try {
      const { remote_id, username, session_id } = req.body;

      const user = await User.findOne({ remote_id, username }).select('balance');

      if (!user) {
        return res.status(404).json({ status: '404', message: 'User not found' });
      }

      return res.status(200).json({ status: '200', balance: user.balance });
    } catch (error) {
      console.error('Error getting balance:', error);
      return res.status(500).json({ status: '500', message: 'Internal server error' });
    }
  }

  async debit(req, res) {
    if (!this.checkRequestIntegrity(req)) {
      return res.status(403).json({ status: '403', message: 'Request integrity check failed' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: '400', errors: 'Validation Faild' });
    }

    try {
      const { remote_id, username, amount, transaction_id } = req.body;

      const user = await User.findOneAndUpdate(
        { remote_id, username, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ status: '404', message: 'User not found or insufficient funds' });
      }

      await Transaction.create({
        action: 'debit',
        remote_id,
        amount,
        transaction_id,
        provider: req.body.provider,
        game_id: req.body.game_id,
        gameplay_final: req.body.gameplay_final,
        round_id: req.body.round_id,
        game_id_hash: req.body.game_id_hash,
        session_id: req.body.session_id,
        gamesession_id: req.body.gamesession_id,
      });

      return res.status(200).json({ status: '200', balance: user.balance });
    } catch (error) {
      console.error('Error debiting balance:', error);
      return res.status(500).json({ status: '500', message: 'Internal server error' });
    }
  }

  async credit(req, res) {
    if (!this.checkRequestIntegrity(req)) {
      return res.status(403).json({ status: '403', message: 'Request integrity check failed' });
    }
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: '400', errors: errors.array() });
    }
  
    try {
      const { remote_id, username, amount, transaction_id } = req.body;
  
      const user = await User.findOneAndUpdate(
        { remote_id, username },
        { $inc: { balance: amount } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ status: '404', message: 'User not found' });
      }
  
      const existingTransaction = await Transaction.findOne({ transaction_id, remote_id });
      if (existingTransaction) {
        return res.status(200).json({ status: '200', balance: user.balance, 'valid amount': 'false' });
      }
  
      if (amount < 0) {
        return res.status(403).json({ status: '403', message: 'Negative amount not allowed' });
      }
  
      await Transaction.create({
        action: 'credit',
        remote_id,
        amount,
        provider: req.body.provider,
        game_id: req.body.game_id,
        transaction_id,
        gameplay_final: req.body.gameplay_final,
        round_id: req.body.round_id,
        game_id_hash: req.body.game_id_hash,
        session_id: req.body.session_id,
        gamesession_id: req.body.gamesession_id,
      });
  
      user.balance += amount;
      await user.save();
  
      return res.status(200).json({ status: '200', balance: user.balance, 'valid amount': 'true' });
    } catch (error) {
      console.error('Error crediting balance:', error);
      return res.status(500).json({ status: '500', message: 'Internal server error' });
    }
  }
  

  async rollback(req, res) {
    try {
      const { remote_id, username, transaction_id, session_id } = req.body;
  
      const user = await User.findOneAndUpdate(
        { remote_id, username },
        { $inc: { balance: transaction.amount } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ status: '404', message: 'User not found' });
      }
  
      // Find the transaction to rollback
      const transaction = await Transaction.findOne({ transaction_id });
  
      if (!transaction) {
        return res.status(404).json({ status: '404', message: 'TRANSACTION_NOT_FOUND' });
      }
  
      // Check if the transaction key is already set to '1'
      if (transaction.key === '1') {
        return res.status(200).json({ status: '200', balance: user.balance });
      }
  
      // Reverse the transaction
      if (transaction.action === 'debit') {
        user.balance += transaction.amount;
      } else if (transaction.action === 'credit') {
        user.balance -= transaction.amount;
      } else {
        return res.status(400).json({ status: '400', message: 'Invalid transaction type for rollback' });
      }
  
      // Update the user's balance
      await user.save();
  
      // Set the transaction key to '1'
      transaction.key = '1';
      await transaction.save();
  
      return res.status(200).json({ status: '200', balance: user.balance });
    } catch (error) {
      console.error('Error rolling back transaction:', error);
      return res.status(500).json({ status: '500', message: 'Internal server error during rollback' });
    }
  }
  

  checkRequestIntegrity(req) {
    const requestData = { ...req.body };
    const key = requestData.key;
    delete requestData.key;

    const sortedData = {};
    Object.keys(requestData).sort().forEach(function(key) {
        sortedData[key] = requestData[key];
    });

    const queryString = querystring.stringify(sortedData);
    const hash = crypto.createHash('sha1').update(this.salt + queryString).digest('hex');

    return key === hash;
}

  
}

module.exports = new WalletController();
