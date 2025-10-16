import express from 'express';
import mongoose from 'mongoose';
import StudyJamProgress from '../models/StudyJamProgress.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/study-jams/progress
// @desc    Get user's Study Jam progress
// @access  Private
router.get('/progress', protect, async (req, res, next) => {
  try {
    const { eventId } = req.query;

    let query = { user: req.user._id };
    if (eventId) {
      query.event = eventId;
    }

    const progress = await StudyJamProgress.find(query)
      .populate('event', 'name date')
      .sort({ createdAt: -1 });

    // Calculate stats
    const totalLabs = progress.length;
    const completedLabs = progress.filter(p => p.completed).length;
    const totalPoints = progress.reduce((sum, p) => sum + p.points, 0);

    res.json({
      success: true,
      stats: {
        totalLabs,
        completedLabs,
        totalPoints,
        completionRate: totalLabs > 0 ? (completedLabs / totalLabs * 100).toFixed(2) : 0,
      },
      progress,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/study-jams/complete
// @desc    Mark lab as complete
// @access  Private
router.post('/complete', protect, async (req, res, next) => {
  try {
    const { eventId, labId, labName, points, proofUrl } = req.body;

    // Check if already marked complete
    let progress = await StudyJamProgress.findOne({
      user: req.user._id,
      event: eventId,
      labId,
    });

    if (progress) {
      if (progress.completed) {
        return res.status(400).json({
          success: false,
          message: 'Lab already marked as complete',
        });
      }

      // Update existing progress
      progress.completed = true;
      progress.completionDate = Date.now();
      progress.points = points || 0;
      if (proofUrl) progress.completionProofUrl = proofUrl;
      await progress.save();
    } else {
      // Create new progress entry
      progress = await StudyJamProgress.create({
        user: req.user._id,
        event: eventId,
        labId,
        labName,
        completed: true,
        completionDate: Date.now(),
        points: points || 0,
        completionProofUrl: proofUrl,
      });
    }

    res.json({
      success: true,
      message: 'Lab marked as complete',
      progress,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/study-jams/leaderboard
// @desc    Get Study Jam leaderboard
// @access  Public
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { eventId, limit = 50 } = req.query;

    let matchQuery = {};
    if (eventId) {
      matchQuery.event = mongoose.Types.ObjectId(eventId);
    }

    const leaderboard = await StudyJamProgress.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$user',
          totalPoints: { $sum: '$points' },
          completedLabs: { $sum: { $cond: ['$completed', 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          profilePhoto: '$user.profilePhoto',
          totalPoints: 1,
          completedLabs: 1,
        },
      },
      { $sort: { totalPoints: -1, completedLabs: -1 } },
      { $limit: parseInt(limit) },
    ]);

    // Add rank
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.json({
      success: true,
      count: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
