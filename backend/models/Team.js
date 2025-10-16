import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
  },
  teamLeader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  maxMembers: {
    type: Number,
    default: 4,
  },
  projectTitle: {
    type: String,
    default: null,
  },
  projectDescription: {
    type: String,
    default: null,
  },
  githubUrl: {
    type: String,
    default: null,
  },
  demoVideoUrl: {
    type: String,
    default: null,
  },
  submissionTime: {
    type: Date,
    default: null,
  },
  score: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: null,
  },
}, {
  timestamps: true,
});

// Compound unique index for event and team name
teamSchema.index({ event: 1, teamName: 1 }, { unique: true });

const Team = mongoose.model('Team', teamSchema);

export default Team;
