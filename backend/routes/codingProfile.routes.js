import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/User.js';
import codingProfileService from '../services/codingProfileService.js';

const router = express.Router();

/**
 * @route   GET /api/coding-profiles
 * @desc    Get user's coding profiles
 * @access  Private
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      profiles: user.codingProfiles || {}
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/coding-profiles/add
 * @desc    Add or update a coding profile username
 * @access  Private
 */
router.post('/add', protect, async (req, res, next) => {
  try {
    const { platform, username } = req.body;

    // Validation
    if (!platform || !username) {
      return res.status(400).json({ 
        message: 'Platform and username are required' 
      });
    }

    if (!['leetcode', 'codechef'].includes(platform)) {
      return res.status(400).json({ 
        message: 'Invalid platform. Must be "leetcode" or "codechef"' 
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch profile data from the platform
    console.log(`🔍 Fetching ${platform} data for username: ${username}`);
    let profileData;

    try {
      if (platform === 'leetcode') {
        profileData = await codingProfileService.fetchLeetCodeData(username);
      } else if (platform === 'codechef') {
        profileData = await codingProfileService.fetchCodeChefData(username);
      }
    } catch (error) {
      return res.status(400).json({ 
        message: error.message || `Failed to fetch ${platform} profile` 
      });
    }

    // Update user's coding profile
    if (!user.codingProfiles) {
      user.codingProfiles = {};
    }
    
    user.codingProfiles[platform] = profileData;
    await user.save();

    console.log(`✅ Successfully added ${platform} profile for user ${user._id}`);

    res.json({
      success: true,
      message: `${platform} profile added successfully`,
      profile: profileData
    });
  } catch (error) {
    console.error('❌ Add profile error:', error);
    next(error);
  }
});

/**
 * @route   PUT /api/coding-profiles/refresh/:platform
 * @desc    Refresh coding profile data manually
 * @access  Private
 */
router.put('/refresh/:platform', protect, async (req, res, next) => {
  try {
    const { platform } = req.params;

    if (!['leetcode', 'codechef'].includes(platform)) {
      return res.status(400).json({ 
        message: 'Invalid platform. Must be "leetcode" or "codechef"' 
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has this profile
    if (!user.codingProfiles || !user.codingProfiles[platform]?.username) {
      return res.status(404).json({ 
        message: `No ${platform} profile found. Please add your username first.` 
      });
    }

    const username = user.codingProfiles[platform].username;
    console.log(`🔄 Refreshing ${platform} data for username: ${username}`);

    // Fetch updated profile data
    let profileData;
    try {
      if (platform === 'leetcode') {
        profileData = await codingProfileService.fetchLeetCodeData(username);
      } else if (platform === 'codechef') {
        profileData = await codingProfileService.fetchCodeChefData(username);
      }
    } catch (error) {
      return res.status(400).json({ 
        message: error.message || `Failed to refresh ${platform} profile` 
      });
    }

    // Update user's coding profile
    user.codingProfiles[platform] = profileData;
    await user.save();

    console.log(`✅ Successfully refreshed ${platform} profile for user ${user._id}`);

    res.json({
      success: true,
      message: `${platform} profile refreshed successfully`,
      profile: profileData
    });
  } catch (error) {
    console.error('❌ Refresh profile error:', error);
    next(error);
  }
});

/**
 * @route   DELETE /api/coding-profiles/:platform
 * @desc    Remove a coding profile
 * @access  Private
 */
router.delete('/:platform', protect, async (req, res, next) => {
  try {
    const { platform } = req.params;

    if (!['leetcode', 'codechef'].includes(platform)) {
      return res.status(400).json({ 
        message: 'Invalid platform. Must be "leetcode" or "codechef"' 
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the profile
    if (user.codingProfiles && user.codingProfiles[platform]) {
      user.codingProfiles[platform] = {
        username: null,
        rank: null,
        rating: null,
        problemsSolved: platform === 'leetcode' ? { easy: 0, medium: 0, hard: 0, total: 0 } : undefined,
        stars: platform === 'codechef' ? 0 : undefined,
        globalRank: platform === 'codechef' ? null : undefined,
        countryRank: platform === 'codechef' ? null : undefined,
        highestRating: platform === 'codechef' ? null : undefined,
        lastUpdated: null,
        verified: false
      };
      
      await user.save();
      
      console.log(`✅ Removed ${platform} profile for user ${user._id}`);
    }

    res.json({
      success: true,
      message: `${platform} profile removed successfully`
    });
  } catch (error) {
    console.error('❌ Remove profile error:', error);
    next(error);
  }
});

/**
 * @route   POST /api/coding-profiles/verify
 * @desc    Verify if a username exists on a platform (without saving)
 * @access  Private
 */
router.post('/verify', protect, async (req, res, next) => {
  try {
    const { platform, username } = req.body;

    if (!platform || !username) {
      return res.status(400).json({ 
        message: 'Platform and username are required' 
      });
    }

    if (!['leetcode', 'codechef'].includes(platform)) {
      return res.status(400).json({ 
        message: 'Invalid platform. Must be "leetcode" or "codechef"' 
      });
    }

    const exists = await codingProfileService.verifyUsername(platform, username);

    res.json({
      success: true,
      exists,
      message: exists 
        ? `Username found on ${platform}` 
        : `Username not found on ${platform}`
    });
  } catch (error) {
    next(error);
  }
});

export default router;
