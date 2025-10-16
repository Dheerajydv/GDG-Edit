import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'waitlist'],
    default: 'approved', // Auto-approve by default
  },
  formData: {
    fullName: String,
    email: String,
    phone: String,
    college: String,
    year: String,
    branch: String,
    reason: String,
  },
  attended: {
    type: Boolean,
    default: false,
  },
  attendanceTime: {
    type: Date,
    default: null,
  },
  qrCode: {
    type: String,
    default: null,
  },
  certificateIssued: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

// Index for queries
registrationSchema.index({ event: 1, status: 1 });
registrationSchema.index({ user: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
