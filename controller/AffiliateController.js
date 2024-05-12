const Affiliate = require('../models/AffiliateModel');
const User = require('../models/UserModel');

// Function to calculate commission based on referral count and total wager
const calculateCommission = (referralCount, totalWager) => {
  let commissionRate = 0;
  if (referralCount >= 100) {
    commissionRate = 0.20;
  } else if (referralCount >= 10) {
    commissionRate = 0.10;
  } else {
    commissionRate = 0.05;
  }
  return commissionRate * totalWager;
};

// Function to calculate level-up bonus based on wager amount and current level
const calculateLevelUpBonus = (wager, level) => {
  let levelUpBonus = 0;
  switch (level) {
    case 'Bronze 1':
      levelUpBonus = 10;
      break;
    case 'Bronze 2':
      levelUpBonus = 19;
      break;
    case 'Bronze 3':
      levelUpBonus = 27;
      break;
    case 'Silver 1':
      levelUpBonus = 42.50;
      break;
    case 'Silver 2':
      levelUpBonus = 60.00;
      break;
    case 'Silver 3':
      levelUpBonus = 75.00;
      break;
    case 'Gold 1':
      levelUpBonus = 140.00;
      break;
    case 'Gold 2':
      levelUpBonus = 195.00;
      break;
    case 'Gold 3':
      levelUpBonus = 240.00;
      break;
    case 'Platinum 1':
      levelUpBonus = 440.00;
      break;
    case 'Platinum 2':
      levelUpBonus = 500.00;
      break;
    case 'Platinum 3':
      levelUpBonus = 900.00;
      break;
    case 'Diamond 1':
      levelUpBonus = 4000.00;
      break;
    case 'Diamond 2':
      levelUpBonus = 17500.00;
      break;
    case 'Diamond 3':
      levelUpBonus = 30000.00;
      break;
    case 'Blood Diamond':
      levelUpBonus = 125000.00;
      break;
    case 'Vibranium':
      levelUpBonus = 200000.00;
      break;
    default:
      levelUpBonus = 0;
  }
  // Apply decreasing bonus rate
  levelUpBonus -= levelUpBonus * (0.005 * (parseInt(level.split(' ')[1]) - 1));
  return levelUpBonus;
};

// Function to calculate daily, weekly, and monthly bonuses based on wager amount and level
const calculateBonus = (wager, level) => {
  let bonus = 0;
  switch (level.split(' ')[0]) {
    case 'Bronze':
      bonus = wager * 0.01 * 7;
      break;
    case 'Silver':
      bonus = wager * 0.01 * 7;
      break;
    case 'Gold':
      bonus = wager * 0.01 * 5;
      break;
    case 'Platinum':
      bonus = wager * 0.01 * 3;
      break;
    default:
      bonus = 0;
  }
  return bonus;
};

// Controller function to handle affiliate commission and ranking logic
exports.handleAffiliateAndRanking = async (userId) => {
  try {
    // Find the user's affiliate details
    const affiliate = await Affiliate.findOne({ user: userId });
    if (!affiliate) {
      throw new Error('Affiliate details not found for user');
    }

    // Calculate commission
    const commission = calculateCommission(affiliate.referrals, affiliate.totalWagerByReferrals);

    // Check if commission can be claimed
    if (!affiliate.commissionClaimed && affiliate.referrals >= 10 && affiliate.totalWagerByReferrals >= 10000) {
      // Update commission claimed status
      await Affiliate.findOneAndUpdate({ user: userId }, { commissionClaimed: true });
      // Add commission to user's account balance or perform other actions
      const user = await User.findById(userId);
      user.balance += commission;
      await user.save();
    }

    // Find the user's rank based on total wager
    let rank = '';
    if (affiliate.totalWagerByReferrals >= 1000000000) {
      rank = 'Vibranium';
    } else if (affiliate.totalWagerByReferrals >= 500000000) {
      rank = 'Blood Diamond';
    } else if (affiliate.totalWagerByReferrals >= 100000000) {
      rank = 'Diamond 3';
    } else if (affiliate.totalWagerByReferrals >= 50000000) {
      rank = 'Diamond 2';
    } else if (affiliate.totalWagerByReferrals >= 10000000) {
      rank = 'Diamond 1';
    } else if (affiliate.totalWagerByReferrals >= 2000000) {
      rank = 'Platinum 3';
    } else if (affiliate.totalWagerByReferrals >= 1000000) {
      rank = 'Platinum 2';
    } else if (affiliate.totalWagerByReferrals >= 800000) {
      rank = 'Platinum 1';
    } else if (affiliate.totalWagerByReferrals >= 400000) {
      rank = 'Gold 3';
    } else if (affiliate.totalWagerByReferrals >= 300000) {
      rank = 'Gold 2';
    } else if (affiliate.totalWagerByReferrals >= 200000) {
      rank = 'Gold 1';
    } else if (affiliate.totalWagerByReferrals >= 100000) {
      rank = 'Silver 3';
    } else if (affiliate.totalWagerByReferrals >= 75000) {
      rank = 'Silver 2';
    } else if (affiliate.totalWagerByReferrals >= 50000) {
      rank = 'Silver 1';
    } else if (affiliate.totalWagerByReferrals >= 30000) {
      rank = 'Bronze 3';
    } else if (affiliate.totalWagerByReferrals >= 20000) {
      rank = 'Bronze 2';
    } else if (affiliate.totalWagerByReferrals >= 10000) {
      rank = 'Bronze 1';
    }

    // Calculate level-up bonus
    const levelUpBonus = calculateLevelUpBonus(affiliate.totalWagerByReferrals, rank);

    // Calculate daily, weekly, and monthly bonuses
    const dailyBonus = calculateBonus(affiliate.totalWagerByReferrals, rank);
    const weeklyBonus = calculateBonus(affiliate.totalWagerByReferrals, rank);
    const monthlyBonus = calculateBonus(affiliate.totalWagerByReferrals, rank);

    // Return all calculated values
    return {
      commission,
      rank,
      levelUpBonus,
      dailyBonus,
      weeklyBonus,
      monthlyBonus,
    };
  } catch (error) {
    console.error('Error handling affiliate and ranking:', error);
    throw new Error('Error handling affiliate and ranking');
  }
};
