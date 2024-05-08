const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  action: String,
  remote_id: String,
  amount: Number,
  provider: String,
  game_id: Number,
  transaction_id: String, 
  gameplay_final: Number,
  round_id: String,
  game_id_hash: String,
  session_id: String,
  key: String,
  gamesession_id: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
