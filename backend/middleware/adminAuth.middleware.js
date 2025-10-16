/**
 * Admin Authentication Middleware
 * Checks if user is authenticated and has admin privileges
 */

const adminAuth = (req, res, next) => {
  try {
    // Check if user exists (from protect middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has admin role
    const adminRoles = ['admin', 'event_manager', 'super_admin'];
    
    if (!adminRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during admin authentication',
      error: error.message
    });
  }
};

export default adminAuth;
