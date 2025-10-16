import mongoose from 'mongoose';

const studyJamProgressSchema = new mongoose.Schema({
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
  labId: {
    type: String,
    required: true,
  },
  labName: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completionDate: {
    type: Date,
    default: null,
  },
  points: {
    type: Number,
    default: 0,
  },
  completionProofUrl: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Compound unique index
studyJamProgressSchema.index({ user: 1, event: 1, labId: 1 }, { unique: true });

const StudyJamProgress = mongoose.model('StudyJamProgress', studyJamProgressSchema);

export default StudyJamProgress;
