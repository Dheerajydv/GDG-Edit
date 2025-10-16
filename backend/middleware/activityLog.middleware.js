/**
 * Activity Log Middleware
 * Automatically logs admin actions for audit trail
 */
import ActivityLog from '../models/ActivityLog.js';

/**
 * Log admin action
 * @param {string} action - Action performed (e.g., 'created_event', 'deleted_user')
 * @param {string} resource - Resource type (e.g., 'event', 'user')
 */
export const logActivity = (action, resource) => {
  return async (req, res, next) => {
    // Store original json function
    const originalJson = res.json;

    // Override res.json to log after successful response
    res.json = async function(data) {
      try {
        // Only log if response is successful
        if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
          const resourceId = req.params.id || data?.data?._id || data?._id;

          await ActivityLog.create({
            admin: req.user._id,
            action,
            resource,
            resourceId,
            details: {
              method: req.method,
              path: req.path,
              body: req.body,
              query: req.query,
              ip: req.ip || req.connection.remoteAddress,
              userAgent: req.get('user-agent')
            }
          });
        }
      } catch (error) {
        console.error('Failed to log activity:', error);
        // Don't fail the request if logging fails
      }

      // Call original json function
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Get activity logs for a specific admin
 */
export const getAdminLogs = async (adminId, limit = 50) => {
  return await ActivityLog.find({ admin: adminId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('admin', 'name email');
};

/**
 * Get activity logs for a specific resource
 */
export const getResourceLogs = async (resourceType, resourceId, limit = 20) => {
  return await ActivityLog.find({
    resource: resourceType,
    resourceId: resourceId
  })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('admin', 'name email');
};

/**
 * Get recent activity across all admins
 */
export const getRecentActivity = async (limit = 100) => {
  return await ActivityLog.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('admin', 'name email profilePhoto');
};

export default {
  logActivity,
  getAdminLogs,
  getResourceLogs,
  getRecentActivity
};
