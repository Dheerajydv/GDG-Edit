import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    select: false, // Don't return password by default
  },
  profilePhoto: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  college: {
    type: String,
    default: null,
  },
  year: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  branch: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'event_manager', 'super_admin'],
    default: 'student',
  },
  oauthProvider: {
    type: String,
    enum: ['email', 'google', 'github'],
    default: 'email',
  },
  googleId: {
    type: String,
    default: null,
  },
  githubId: {
    type: String,
    default: null,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    profilePhoto: this.profilePhoto,
    phone: this.phone,
    college: this.college,
    year: this.year,
    branch: this.branch,
    role: this.role,
    oauthProvider: this.oauthProvider,
    emailVerified: this.emailVerified,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model('User', userSchema);

export default User;
