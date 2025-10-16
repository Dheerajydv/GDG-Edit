/**
 * Role-based Access Control Middleware
 * Checks if user has specific role(s) required for an action
 */

/**
 * Create middleware to check if user has required role(s)
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @returns {Function} Express middleware
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Convert to array if single role provided
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // Check if user's role is in allowed roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${roles.join(' or ')}`
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error during role verification',
        error: error.message
      });
    }
  };
};

/**
 * Check if user is super admin (highest privilege)
 */
export const requireSuperAdmin = requireRole('super_admin');

/**
 * Check if user is admin or super admin
 */
export const requireAdmin = requireRole(['admin', 'super_admin']);

/**
 * Check if user is event manager, admin, or super admin
 */
export const requireEventManager = requireRole(['event_manager', 'admin', 'super_admin']);

/**
 * Check if user owns the resource or is admin
 * @param {Function} getOwnerId - Function to extract owner ID from request
 */
export const requireOwnerOrAdmin = (getOwnerId) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const ownerId = getOwnerId(req);
      const isOwner = req.user._id.toString() === ownerId?.toString();
      const isAdmin = ['admin', 'super_admin'].includes(req.user.role);

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only modify your own resources.'
        });
      }

      // Add flag to indicate if user is owner
      req.isOwner = isOwner;
      req.isAdmin = isAdmin;

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error during ownership verification',
        error: error.message
      });
    }
  };
};

export default {
  requireRole,
  requireSuperAdmin,
  requireAdmin,
  requireEventManager,
  requireOwnerOrAdmin
};
