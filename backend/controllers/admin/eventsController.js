import Event from '../../models/Event.js';
import Registration from '../../models/Registration.js';

/**
 * @desc    Get all events with filtering and pagination
 * @route   GET /api/admin/events
 * @access  Private/Admin
 */
export const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      type,
      mode,
      eventCategory,
      published,
      sortBy = 'date',
      order = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) filter.type = type;
    if (mode || eventCategory) filter.eventCategory = mode || eventCategory;
    if (published !== undefined) filter.published = published === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      Event.countDocuments(filter)
    ]);

    // Get registration counts for each event
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const [totalRegistrations, attendedCount] = await Promise.all([
          Registration.countDocuments({ event: event._id }),
          Registration.countDocuments({ event: event._id, attended: true })
        ]);

        return {
          ...event.toObject(),
          stats: {
            totalRegistrations,
            attendedCount,
            capacityUsed: event.capacity ? 
              Math.round((totalRegistrations / event.capacity) * 100) : 0
          }
        };
      })
    );

    res.json({
      success: true,
      events: eventsWithStats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

/**
 * @desc    Get single event details
 * @route   GET /api/admin/events/:id
 * @access  Private/Admin
 */
export const getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get registrations for this event
    const [registrations, totalRegistrations, approvedCount, pendingCount, rejectedCount] = await Promise.all([
      Registration.find({ event: event._id })
        .populate('user', 'name email college year')
        .sort({ createdAt: -1 })
        .limit(50),
      Registration.countDocuments({ event: event._id }),
      Registration.countDocuments({ event: event._id, status: 'approved' }),
      Registration.countDocuments({ event: event._id, status: 'pending' }),
      Registration.countDocuments({ event: event._id, status: 'rejected' })
    ]);

    res.json({
      success: true,
      event: {
        ...event.toObject(),
        registrations,
        stats: {
          totalRegistrations,
          approvedCount,
          pendingCount,
          rejectedCount
        }
      }
    });
  } catch (error) {
    console.error('Get event details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event details',
      error: error.message
    });
  }
};

/**
 * @desc    Create new event
 * @route   POST /api/admin/events
 * @access  Private/EventManager
 */
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

/**
 * @desc    Update event
 * @route   PUT /api/admin/events/:id
 * @access  Private/EventManager
 */
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

/**
 * @desc    Delete event
 * @route   DELETE /api/admin/events/:id
 * @access  Private/Admin
 */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Optionally delete related registrations
    // await Registration.deleteMany({ event: event._id });

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};

/**
 * @desc    Publish/Unpublish event
 * @route   PATCH /api/admin/events/:id/publish
 * @access  Private/EventManager
 */
export const togglePublishEvent = async (req, res) => {
  try {
    const { publish } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { published: publish },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: publish ? 'Event published successfully' : 'Event unpublished successfully',
      event
    });
  } catch (error) {
    console.error('Publish event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish/unpublish event',
      error: error.message
    });
  }
};

/**
 * @desc    Duplicate event
 * @route   POST /api/admin/events/:id/duplicate
 * @access  Private/EventManager
 */
export const duplicateEvent = async (req, res) => {
  try {
    const originalEvent = await Event.findById(req.params.id);

    if (!originalEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const eventData = originalEvent.toObject();
    delete eventData._id;
    delete eventData.createdAt;
    delete eventData.updatedAt;
    
    const newEvent = await Event.create({
      ...eventData,
      name: `${eventData.name} (Copy)`,
      published: false,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Event duplicated successfully',
      event: newEvent
    });
  } catch (error) {
    console.error('Duplicate event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate event',
      error: error.message
    });
  }
};

/**
 * @desc    Get event analytics
 * @route   GET /api/admin/events/:id/analytics
 * @access  Private/Admin
 */
export const getEventAnalytics = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Registration stats by college
    const registrationsByCollege = await Registration.aggregate([
      { $match: { event: event._id } },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
      { $unwind: '$userInfo' },
      { $group: { _id: '$userInfo.college', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Registration stats by year
    const registrationsByYear = await Registration.aggregate([
      { $match: { event: event._id } },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'userInfo' } },
      { $unwind: '$userInfo' },
      { $group: { _id: '$userInfo.year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Attendance rate
    const [totalRegistrations, attendedCount] = await Promise.all([
      Registration.countDocuments({ event: event._id }),
      Registration.countDocuments({ event: event._id, attended: true })
    ]);

    const attendanceRate = totalRegistrations > 0 ? 
      Math.round((attendedCount / totalRegistrations) * 100) : 0;

    res.json({
      success: true,
      analytics: {
        registrationsByCollege,
        registrationsByYear,
        attendanceRate,
        totalRegistrations,
        attendedCount
      }
    });
  } catch (error) {
    console.error('Get event analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event analytics',
      error: error.message
    });
  }
};

export default {
  getAllEvents,
  getEventDetails,
  createEvent,
  updateEvent,
  deleteEvent,
  togglePublishEvent,
  duplicateEvent,
  getEventAnalytics
};
