import express from 'express';
import Certificate from '../models/Certificate.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/certificates/my-certificates
// @desc    Get user's certificates
// @access  Private
router.get('/my-certificates', protect, async (req, res, next) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate('event', 'name date type')
      .sort({ issuedAt: -1 });

    res.json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/certificates/verify/:code
// @desc    Verify certificate by code
// @access  Public
router.get('/verify/:code', async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateCode: req.params.code 
    })
      .populate('user', 'name email')
      .populate('event', 'name date type location');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    res.json({
      success: true,
      certificate,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/certificates
// @desc    Issue certificate
// @access  Private (Admin only)
router.post('/', protect, authorize('admin', 'event_manager', 'super_admin'), async (req, res, next) => {
  try {
    const { userId, eventId, certificateUrl } = req.body;

    // Check if certificate already issued
    const existing = await Certificate.findOne({
      user: userId,
      event: eventId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already issued for this user and event',
      });
    }

    // Generate unique certificate code
    const certificateCode = `GDG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const certificate = await Certificate.create({
      user: userId,
      event: eventId,
      certificateUrl,
      certificateCode,
    });

    await certificate.populate('user event');

    res.status(201).json({
      success: true,
      certificate,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
