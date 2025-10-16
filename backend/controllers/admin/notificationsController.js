import Notification from '../../models/Notification.js';
import User from '../../models/User.js';
import Event from '../../models/Event.js';

/**
 * @desc    Create notification
 * @route   POST /api/admin/notifications
 * @access  Private/Admin
 */
export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
};

/**
 * @desc    Get all notifications
 * @route   GET /api/admin/notifications
 * @access  Private/Admin
 */
export const getAllNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .populate('createdBy', 'name email')
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments(filter)
    ]);

    res.json({
      success: true,
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

/**
 * @desc    Get notification details
 * @route   GET /api/admin/notifications/:id
 * @access  Private/Admin
 */
export const getNotificationDetails = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Get notification details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification details',
      error: error.message
    });
  }
};

/**
 * @desc    Send notification
 * @route   POST /api/admin/notifications/:id/send
 * @access  Private/Admin
 */
export const sendNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.status === 'sent') {
      return res.status(400).json({
        success: false,
        message: 'Notification already sent'
      });
    }

    // Build recipient filter based on targeting
    let recipientFilter = {};
    
    if (notification.recipients.targetType === 'all') {
      recipientFilter = {};
    } else if (notification.recipients.targetType === 'role') {
      recipientFilter = { role: { $in: notification.recipients.roles } };
    } else if (notification.recipients.targetType === 'event') {
      // Get users registered for specific events
      const Registration = (await import('../../models/Registration.js')).default;
      const registrations = await Registration.find({ 
        event: { $in: notification.recipients.events } 
      }).distinct('user');
      recipientFilter = { _id: { $in: registrations } };
    } else if (notification.recipients.targetType === 'custom') {
      recipientFilter = { _id: { $in: notification.recipients.userIds } };
    }

    // Get recipients
    const users = await User.find(recipientFilter).select('email name');

    // Update notification status
    notification.status = 'sending';
    notification.stats.totalRecipients = users.length;
    await notification.save();

    // TODO: Implement actual sending logic based on notification.type
    // - 'alert': In-app notification
    // - 'email': Send emails using nodemailer
    // - 'push': Send push notifications
    // - 'sms': Send SMS

    // For now, mark as sent
    setTimeout(async () => {
      notification.status = 'sent';
      notification.sentAt = new Date();
      notification.stats.sent = users.length;
      await notification.save();
    }, 1000);

    res.json({
      success: true,
      message: `Notification queued for ${users.length} recipients`,
      recipientCount: users.length
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
};

/**
 * @desc    Schedule notification
 * @route   PATCH /api/admin/notifications/:id/schedule
 * @access  Private/Admin
 */
export const scheduleNotification = async (req, res) => {
  try {
    const { scheduledFor } = req.body;

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'scheduled',
        scheduledFor: new Date(scheduledFor)
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // TODO: Implement scheduler (node-cron or Bull queue) to send at scheduled time

    res.json({
      success: true,
      message: 'Notification scheduled successfully',
      notification
    });
  } catch (error) {
    console.error('Schedule notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule notification',
      error: error.message
    });
  }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/admin/notifications/:id
 * @access  Private/Admin
 */
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

/**
 * @desc    Get notification stats
 * @route   GET /api/admin/notifications/stats
 * @access  Private/Admin
 */
export const getNotificationStats = async (req, res) => {
  try {
    const [totalSent, totalScheduled, totalDraft, avgOpenRate] = await Promise.all([
      Notification.countDocuments({ status: 'sent' }),
      Notification.countDocuments({ status: 'scheduled' }),
      Notification.countDocuments({ status: 'draft' }),
      Notification.aggregate([
        { $match: { status: 'sent', 'stats.totalRecipients': { $gt: 0 } } },
        { 
          $project: { 
            openRate: { 
              $multiply: [
                { $divide: ['$stats.opened', '$stats.totalRecipients'] },
                100
              ]
            }
          }
        },
        { $group: { _id: null, avgOpenRate: { $avg: '$openRate' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalSent,
        totalScheduled,
        totalDraft,
        avgOpenRate: avgOpenRate[0]?.avgOpenRate || 0
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification stats',
      error: error.message
    });
  }
};

export default {
  createNotification,
  getAllNotifications,
  getNotificationDetails,
  sendNotification,
  scheduleNotification,
  deleteNotification,
  getNotificationStats
};
