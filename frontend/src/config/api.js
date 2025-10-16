// API Configuration
// Automatically uses production URL when deployed to Vercel
// For local development, uses localhost:5000

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  PROFILE: '/api/auth/profile',
  GOOGLE_AUTH: '/api/auth/google',
  GITHUB_AUTH: '/api/auth/github',
  LOGOUT: '/api/auth/logout',
  CONTACT: '/api/auth/contact',
  
  // Events
  EVENTS: '/api/events',
  EVENT_BY_ID: (id) => `/api/events/${id}`,
  EVENTS_BY_CATEGORY: (category) => `/api/events/category/${category}`,
  
  // Registrations
  REGISTER_EVENT: '/api/registrations',
  MY_EVENTS: '/api/registrations/my-events',
  EVENT_REGISTRATIONS: (eventId) => `/api/registrations/event/${eventId}`,
  REGISTRATION_QR: (id) => `/api/registrations/${id}/qr-code`,
  
  // Study Jams
  STUDY_JAM_PROGRESS: '/api/study-jams/progress',
  COMPLETE_LAB: '/api/study-jams/complete',
  LEADERBOARD: '/api/study-jams/leaderboard',
  
  // Teams (Hackblitz)
  TEAMS: '/api/teams',
  EVENT_TEAMS: (eventId) => `/api/teams/event/${eventId}`,
  JOIN_TEAM: (id) => `/api/teams/${id}/join`,
  SUBMIT_PROJECT: (id) => `/api/teams/${id}/submit`,
  TEAM_LEADERBOARD: (eventId) => `/api/teams/leaderboard/${eventId}`,
  
  // Certificates
  MY_CERTIFICATES: '/api/certificates/my-certificates',
  VERIFY_CERTIFICATE: (code) => `/api/certificates/verify/${code}`,
  
  // Users (Admin)
  USERS: '/api/users',
  USER_BY_ID: (id) => `/api/users/${id}`,
  USER_STATS: '/api/users/stats/overview',
  
  // Legacy endpoints (for compatibility)
  RSVP: '/api/rsvp/user',
};

export default API_BASE_URL;
