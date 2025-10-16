# 🏆 Coding Profiles Feature - Complete Implementation Guide

## ✅ Implementation Summary

This feature allows users to add their **LeetCode** and **CodeChef** usernames to their GDG profile and automatically fetch and display their competitive programming statistics.

---

## 📋 Features Implemented

### Backend Features:
1. ✅ **Extended User Model** - Added `codingProfiles` field with LeetCode and CodeChef data
2. ✅ **API Integration Service** - Fetches data from LeetCode GraphQL API and CodeChef
3. ✅ **RESTful API Routes** - Complete CRUD operations for coding profiles
4. ✅ **Automatic Daily Refresh** - Cron job updates all profiles at 3 AM IST
5. ✅ **Manual Refresh** - Users can manually update their stats anytime
6. ✅ **Error Handling** - Robust error handling with user-friendly messages

### Frontend Features:
1. ✅ **Profile Display Component** - Beautiful cards showing stats, ranks, and problems solved
2. ✅ **Add Profile Modal** - Clean UI for adding LeetCode/CodeChef usernames
3. ✅ **Manual Refresh Button** - Per-platform refresh with loading states
4. ✅ **Responsive Design** - Works on desktop, tablet, and mobile
5. ✅ **Google Material Design** - Consistent with GDG branding
6. ✅ **Empty States** - Encourages users to add profiles when none exist

---

## 🏗️ Architecture Overview

```
User Profile Page
       │
       ├─> CodingProfiles Component
       │   ├─> Displays LeetCode card
       │   ├─> Displays CodeChef card
       │   └─> Refresh buttons
       │
       └─> AddProfileModal Component
           └─> Platform selector + username input
                   │
                   ▼
              Backend API
                   │
                   ├─> codingProfileService
                   │   ├─> LeetCode GraphQL API
                   │   └─> CodeChef API/Scraping
                   │
                   ├─> MongoDB (User.codingProfiles)
                   │
                   └─> cronJobService
                       └─> Daily auto-refresh at 3 AM IST
```

---

## 📁 Files Created/Modified

### Backend:

#### 1. **models/User.js** (Modified)
- Added `codingProfiles` field with nested structure:
  ```javascript
  codingProfiles: {
    leetcode: {
      username, rank, rating, problemsSolved: { easy, medium, hard, total },
      lastUpdated, verified
    },
    codechef: {
      username, stars, rating, globalRank, countryRank, highestRating,
      lastUpdated, verified
    }
  }
  ```

#### 2. **services/codingProfileService.js** (Created)
- `fetchLeetCodeData(username)` - Uses LeetCode GraphQL API
- `fetchCodeChefData(username)` - Uses unofficial API with scraping fallback
- `verifyUsername(platform, username)` - Checks if username exists
- `calculateStars(rating)` - Converts CodeChef rating to stars
- Error handling and data transformation

#### 3. **services/cronJobService.js** (Created)
- `init()` - Initialize cron jobs
- `scheduleDailyCodingProfileRefresh()` - Schedule 3 AM refresh
- `refreshAllCodingProfiles()` - Refresh all users' profiles
- `triggerManualRefresh()` - Manual trigger for testing

#### 4. **routes/codingProfile.routes.js** (Created)
- `GET /api/coding-profiles` - Get user's profiles
- `POST /api/coding-profiles/add` - Add new profile
- `PUT /api/coding-profiles/refresh/:platform` - Refresh specific platform
- `DELETE /api/coding-profiles/:platform` - Remove profile
- `POST /api/coding-profiles/verify` - Verify username exists

#### 5. **server.js** (Modified)
- Import and mount coding profile routes
- Initialize cron job service on startup

### Frontend:

#### 6. **components/CodingProfiles.jsx** (Created)
- Main display component for coding profiles
- Profile cards with stats, ranks, problems solved
- Manual refresh buttons with loading states
- Empty state with call-to-action
- Responsive grid layout

#### 7. **components/AddProfileModal.jsx** (Created)
- Modal for adding LeetCode/CodeChef username
- Platform selector with logos
- Form validation
- Success/error messages
- Loading states

#### 8. **pages/Dashboard/Profile.jsx** (Modified)
- Integrated CodingProfiles component
- Added AddProfileModal
- Modal open/close state management

---

## 🔌 API Endpoints

### Base URL: `http://localhost:5000/api/coding-profiles`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's coding profiles | ✅ Yes |
| POST | `/add` | Add/update coding profile | ✅ Yes |
| PUT | `/refresh/:platform` | Refresh specific platform data | ✅ Yes |
| DELETE | `/:platform` | Remove coding profile | ✅ Yes |
| POST | `/verify` | Verify username exists | ✅ Yes |

### Example Requests:

#### Add Profile:
```bash
POST /api/coding-profiles/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "platform": "leetcode",
  "username": "john_doe"
}
```

#### Refresh Profile:
```bash
PUT /api/coding-profiles/refresh/leetcode
Authorization: Bearer <token>
```

#### Get Profiles:
```bash
GET /api/coding-profiles
Authorization: Bearer <token>
```

---

## 🎨 UI Components

### 1. **CodingProfiles Component**

**Features:**
- Grid layout showing LeetCode and CodeChef cards
- Stats displayed: Rank, Rating, Problems Solved, Stars
- Color-coded difficulty breakdown (Easy/Medium/Hard)
- Last updated timestamp
- Individual refresh buttons per platform
- Empty state when no profiles exist

**Props:**
- `onAddProfile()` - Callback when "Add Platform" button clicked
- `onEditProfile()` - Callback when "Edit Profiles" button clicked

### 2. **AddProfileModal Component**

**Features:**
- Platform selection (LeetCode/CodeChef)
- Username input with validation
- Real-time error/success messages
- Loading state during API calls
- Auto-close after successful addition

**Props:**
- `isOpen` - Boolean to show/hide modal
- `onClose()` - Callback when modal closes
- `onSuccess()` - Callback after successful addition

---

## 🔄 Data Flow

### Adding a Profile:

```
1. User clicks "Add Platform" button
     ↓
2. AddProfileModal opens
     ↓
3. User selects platform (LeetCode/CodeChef)
     ↓
4. User enters username
     ↓
5. Form submitted → POST /api/coding-profiles/add
     ↓
6. Backend calls codingProfileService.fetchLeetCodeData(username)
     ↓
7. Service calls LeetCode GraphQL API
     ↓
8. Response parsed and transformed
     ↓
9. Data saved to User.codingProfiles.leetcode
     ↓
10. Success response sent to frontend
     ↓
11. Profile card appears on page
```

### Manual Refresh:

```
1. User clicks refresh button on profile card
     ↓
2. PUT /api/coding-profiles/refresh/:platform
     ↓
3. Backend fetches latest data from API
     ↓
4. User.codingProfiles updated in database
     ↓
5. Fresh data returned to frontend
     ↓
6. Profile card updates with new stats
```

### Automatic Daily Refresh:

```
1. Cron job triggers at 3:00 AM IST
     ↓
2. cronJobService.refreshAllCodingProfiles() called
     ↓
3. Find all users with coding profiles
     ↓
4. For each user:
     ├─> Refresh LeetCode data
     └─> Refresh CodeChef data
     ↓
5. Save updated data to database
     ↓
6. Log success/error counts
```

---

## 🧪 Testing Guide

### 1. **Backend Testing**

Start the backend server:
```bash
cd backend
npm start
```

Test endpoints using curl or Postman:

```bash
# Get profiles
curl -X GET http://localhost:5000/api/coding-profiles \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add LeetCode profile
curl -X POST http://localhost:5000/api/coding-profiles/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"platform":"leetcode","username":"YOUR_USERNAME"}'

# Refresh profile
curl -X PUT http://localhost:5000/api/coding-profiles/refresh/leetcode \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. **Frontend Testing**

Start the frontend server:
```bash
cd frontend
npm run dev
```

Test flow:
1. ✅ Login to your account
2. ✅ Navigate to Profile page (`/dashboard/profile`)
3. ✅ Scroll to "Competitive Programming" section
4. ✅ Click "Add Platform" button
5. ✅ Select LeetCode or CodeChef
6. ✅ Enter your username
7. ✅ Click "Add Profile"
8. ✅ Verify profile card appears with correct data
9. ✅ Click refresh button
10. ✅ Verify data updates

### 3. **Cron Job Testing**

Test manual trigger:
```javascript
// In backend console or route
import cronJobService from './services/cronJobService.js';
await cronJobService.triggerManualRefresh();
```

Or wait until 3:00 AM IST to see automatic refresh.

---

## 📊 Data Sources

### LeetCode:
- **API:** GraphQL API at `https://leetcode.com/graphql`
- **Method:** POST request with GraphQL query
- **Data Fetched:**
  - Global ranking
  - Reputation/Rating
  - Problems solved (Easy, Medium, Hard, Total)
- **Rate Limits:** None officially documented, but recommended to cache data

### CodeChef:
- **Primary:** Unofficial API at `https://codechef-api.vercel.app/handle/{username}`
- **Fallback:** Web scraping from `https://www.codechef.com/users/{username}`
- **Data Fetched:**
  - Current rating
  - Highest rating
  - Stars (calculated from rating)
  - Global rank
  - Country rank
- **Rate Limits:** Minimal, but scraping can be slow

---

## 🚀 Deployment Considerations

### Environment Variables:
No additional environment variables needed for this feature.

### Database:
- Existing MongoDB schema extended
- No migration needed (fields have defaults)
- Indexes: Consider adding index on `codingProfiles.leetcode.username` and `codingProfiles.codechef.username` for faster lookups

### Scaling:
- Cron job refresh time increases with user count
- Consider batching or parallel processing for >1000 users
- Add rate limiting if hitting API limits

### Monitoring:
- Log cron job execution and success/failure rates
- Monitor API response times
- Alert if refresh fails for consecutive days

---

## 🎯 Future Enhancements

### Phase 2 Features:
- [ ] Add more platforms (Codeforces, AtCoder, HackerRank)
- [ ] Display contest history and badges
- [ ] Leaderboard of top performers in GDG community
- [ ] Achievements system based on milestones
- [ ] Export profile as PDF/image for LinkedIn
- [ ] Contest reminders and notifications
- [ ] Comparison with other GDG members

### Performance Improvements:
- [ ] Cache API responses with Redis
- [ ] Implement exponential backoff for failed requests
- [ ] Add webhook support if platforms offer it
- [ ] Parallel processing for cron job refreshes

---

## 🐛 Troubleshooting

### Common Issues:

#### 1. "LeetCode username not found"
- **Cause:** Username doesn't exist or typo
- **Solution:** Verify username on LeetCode.com

#### 2. "Failed to fetch CodeChef data"
- **Cause:** CodeChef API down or rate limited
- **Solution:** Wait and retry, fallback scraping will kick in

#### 3. Cron job not running
- **Cause:** Server timezone mismatch
- **Solution:** Check server timezone: `date` in terminal, adjust cron schedule

#### 4. Profile not updating
- **Cause:** API cache or network issue
- **Solution:** Use manual refresh button or check backend logs

#### 5. Modal not opening
- **Cause:** State management issue
- **Solution:** Check browser console for errors, verify `isModalOpen` state

---

## 📝 Code Examples

### Adding a Profile (Frontend):
```javascript
const handleAddProfile = async (platform, username) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/coding-profiles/add`,
    { platform, username },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('Profile added:', response.data);
};
```

### Fetching LeetCode Data (Backend):
```javascript
const data = await codingProfileService.fetchLeetCodeData('john_doe');
console.log(data);
// {
//   username: 'john_doe',
//   rank: 12345,
//   rating: 1850,
//   problemsSolved: { easy: 150, medium: 100, hard: 50, total: 300 },
//   lastUpdated: 2025-10-16T10:30:00.000Z,
//   verified: true
// }
```

---

## ✅ Checklist Before Going Live

- [ ] Test with multiple usernames
- [ ] Verify error handling for invalid usernames
- [ ] Test manual refresh functionality
- [ ] Confirm cron job executes at correct time
- [ ] Check responsive design on mobile
- [ ] Verify empty states display correctly
- [ ] Test modal open/close behavior
- [ ] Ensure loading states work properly
- [ ] Check console for any errors
- [ ] Verify data persists after page refresh

---

## 📞 Support

If you encounter any issues:
1. Check backend console logs
2. Check browser console for errors
3. Verify API endpoints are accessible
4. Check database connection
5. Review TESTING_GUIDE.md for detailed testing steps

---

**Created:** October 16, 2025  
**Last Updated:** October 16, 2025  
**Version:** 1.0.0
