const express = require('express');
const Affiliaterouter = express.Router();
const { handleAffiliateAndRanking, createAffiliate } = require('../controller/AffiliateController');

// Define the route for handling affiliate and ranking logic
Affiliaterouter.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await handleAffiliateAndRanking(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Define the route for creating an affiliate
Affiliaterouter.post('/', async (req, res) => {
  try {
    const { userId, referrals, totalWagerByReferrals, commissionClaimed } = req.body;
    const result = await createAffiliate(userId, referrals, totalWagerByReferrals, commissionClaimed);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = Affiliaterouter;
