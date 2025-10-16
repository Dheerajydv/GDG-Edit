import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    // Examples: 'created_event', 'updated_user', 'deleted_registration', etc.
  },
  resource: {
    type: String,
    required: true,
    enum: ['user', 'event', 'registration', 'notification', 'certificate', 'team', 'studyjam', 'settings'],
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  details: {
    method: String,      // HTTP method (GET, POST, PUT, DELETE)
    path: String,        // Request path
    body: Object,        // Request body (sanitized)
    query: Object,       // Query parameters
    ip: String,          // IP address
    userAgent: String,   // User agent string
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false, // We use custom timestamp field
});

// Indexes for efficient querying
activityLogSchema.index({ admin: 1, timestamp: -1 });
activityLogSchema.index({ resource: 1, resourceId: 1 });
activityLogSchema.index({ timestamp: -1 });

// TTL index - auto-delete logs older than 90 days
activityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

// Virtual for formatted action
activityLogSchema.virtual('formattedAction').get(function() {
  return this.action.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
