const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  referrals: {
    type: Number,
    default: 0,
  },
  commissionRate: {
    type: Number,
    default: 0,
  },
  totalWagerByReferrals: {
    type: Number,
    default: 0,
  },
  commissionClaimed: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Affiliate = mongoose.model('Affiliate', affiliateSchema);

module.exports = Affiliate;
