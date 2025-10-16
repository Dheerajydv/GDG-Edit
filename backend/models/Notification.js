import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
  },
  type: {
    type: String,
    enum: ['alert', 'email', 'push', 'sms'],
    default: 'alert',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  recipients: {
    type: {
      type: String,
      enum: ['all', 'role', 'event', 'custom', 'individual'],
      default: 'all',
    },
    filter: {
      role: {
        type: String,
        enum: ['student', 'admin', 'event_manager', 'super_admin'],
      },
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
      colleges: [String],
      years: [Number],
      branches: [String],
      userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
    },
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'failed'],
    default: 'draft',
  },
  scheduledFor: {
    type: Date,
    default: null,
  },
  sentAt: {
    type: Date,
    default: null,
  },
  icon: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  actionButton: {
    text: String,
    link: String,
  },
  stats: {
    totalRecipients: {
      type: Number,
      default: 0,
    },
    sent: {
      type: Number,
      default: 0,
    },
    opened: {
      type: Number,
      default: 0,
    },
    clicked: {
      type: Number,
      default: 0,
    },
    failed: {
      type: Number,
      default: 0,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for filtering
notificationSchema.index({ status: 1, scheduledFor: 1 });
notificationSchema.index({ createdBy: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
