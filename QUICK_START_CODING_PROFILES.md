# 🚀 Quick Start - Coding Profiles Testing

## Step-by-Step Testing Guide

### Prerequisites ✅
- Backend server running on port 5000
- Frontend server running on port 5173
- Logged in to your GDG account
- Valid LeetCode and/or CodeChef username

---

## 🎯 Testing Flow (10 minutes)

### Step 1: Start Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```
Look for:
```
✅ Database connected
⏰ Initializing cron jobs...
✅ Daily coding profile refresh scheduled for 3:00 AM IST
✅ Cron jobs initialized successfully
🚀 Server running on port 5000
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

### Step 2: Navigate to Profile Page

1. Open browser: `http://localhost:5173`
2. Login with your credentials
3. Click on your profile picture (top-right)
4. Select "Profile" from dropdown
5. Scroll down to "Competitive Programming" section

---

### Step 3: Add Your First Profile

#### For LeetCode:

1. Click **"Add Platform"** button
2. Select **LeetCode** card (will highlight in blue)
3. Enter your LeetCode username (e.g., `your_username`)
4. Click **"Add Profile"**
5. Wait 2-5 seconds for API call
6. ✅ Success message appears
7. ✅ LeetCode card appears with your stats

**Expected Data:**
- Global Rank: #123,456
- Rating: 1850
- Problems Solved: Easy (150) | Medium (100) | Hard (50)
- Total: 300 problems
- Last Updated: Today's date

#### For CodeChef:

1. Click **"Add Platform"** again
2. Select **CodeChef** card
3. Enter your CodeChef username
4. Click **"Add Profile"**
5. Wait 3-10 seconds (CodeChef is slower)
6. ✅ Success message appears
7. ✅ CodeChef card appears with your stats

**Expected Data:**
- Current Rating: 1654
- Highest Rating: 1700
- Stars: ⭐⭐⭐⭐ (4 stars)
- Global Rank: #12,345
- Country Rank: #1,234
- Last Updated: Today's date

---

### Step 4: Test Manual Refresh

1. Find the **🔄 refresh button** on a profile card
2. Click it
3. Button should show spinning animation
4. Wait 2-5 seconds
5. ✅ Card updates with latest data
6. ✅ "Last updated" timestamp changes

---

### Step 5: Test Responsiveness

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Try different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1440px)
4. ✅ Cards stack on mobile
5. ✅ Grid layout on desktop
6. ✅ No horizontal scroll

---

### Step 6: Test Error Handling

#### Invalid Username:
1. Click "Add Platform"
2. Select LeetCode
3. Enter: `this_user_does_not_exist_12345`
4. Click "Add Profile"
5. ✅ Error message appears: "LeetCode username not found"

#### Empty Username:
1. Click "Add Platform"
2. Select CodeChef
3. Leave username empty
4. Try to click "Add Profile"
5. ✅ Button is disabled (can't submit)

---

### Step 7: Verify Data Persistence

1. Refresh the page (F5)
2. Navigate away and come back
3. ✅ Profile cards still show your data
4. ✅ Stats remain the same

---

## 🔍 API Testing (Advanced)

### Test Backend Endpoints Directly:

**Get Profiles:**
```powershell
curl -X GET http://localhost:5000/api/coding-profiles -H "Authorization: Bearer YOUR_TOKEN"
```

**Add LeetCode Profile:**
```powershell
$headers = @{"Authorization"="Bearer YOUR_TOKEN"; "Content-Type"="application/json"}
$body = @{"platform"="leetcode"; "username"="your_username"} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:5000/api/coding-profiles/add -Method POST -Headers $headers -Body $body
```

**Refresh CodeChef:**
```powershell
$headers = @{"Authorization"="Bearer YOUR_TOKEN"}
Invoke-RestMethod -Uri http://localhost:5000/api/coding-profiles/refresh/codechef -Method PUT -Headers $headers
```

---

## 📊 Check Database

### Using MongoDB Compass:

1. Connect to your MongoDB instance
2. Navigate to your database
3. Open `users` collection
4. Find your user document
5. Check `codingProfiles` field:

```json
{
  "_id": "...",
  "name": "Your Name",
  "email": "your@email.com",
  "codingProfiles": {
    "leetcode": {
      "username": "your_username",
      "rank": 12345,
      "rating": 1850,
      "problemsSolved": {
        "easy": 150,
        "medium": 100,
        "hard": 50,
        "total": 300
      },
      "lastUpdated": "2025-10-16T10:30:00.000Z",
      "verified": true
    },
    "codechef": {
      "username": "your_username",
      "stars": 4,
      "rating": 1654,
      "globalRank": 12345,
      "countryRank": 1234,
      "highestRating": 1700,
      "lastUpdated": "2025-10-16T10:30:00.000Z",
      "verified": true
    }
  }
}
```

---

## ✅ Success Criteria

After completing all steps, you should see:

- [x] Backend server running without errors
- [x] Frontend displays coding profiles section
- [x] Can add LeetCode profile successfully
- [x] Can add CodeChef profile successfully
- [x] Profile cards show correct data
- [x] Manual refresh works for both platforms
- [x] Invalid usernames show error messages
- [x] Data persists after page refresh
- [x] Responsive on mobile/tablet/desktop
- [x] No console errors in browser DevTools

---

## 🐛 Common Issues & Solutions

### Issue 1: "Module not found: codingProfileService"
**Solution:** Restart backend server:
```powershell
cd backend
npm start
```

### Issue 2: Profile card not appearing after adding
**Solution:** Check browser console for errors, verify token is valid

### Issue 3: CodeChef data taking too long
**Solution:** Normal behavior, CodeChef API/scraping is slower (up to 15 seconds)

### Issue 4: Cron job not visible
**Solution:** Check backend console logs, should show:
```
⏰ Initializing cron jobs...
✅ Daily coding profile refresh scheduled for 3:00 AM IST
```

### Issue 5: Refresh button stuck spinning
**Solution:** API call failed, check backend logs for error details

---

## 📝 Test Usernames

If you don't have accounts, you can use these public profiles for testing:

**LeetCode:**
- `lee215` (very active user)
- `votrubac` (popular contributor)

**CodeChef:**
- `tourist` (legendary competitive programmer)
- `kostka` (top-rated user)

**Note:** You won't be able to verify these are "your" profiles, but you can see the data fetching works!

---

## 🎉 You're Done!

If all tests pass, your coding profiles feature is working perfectly! 

### Next Steps:
1. Add your real LeetCode/CodeChef usernames
2. Share your profile with GDG community
3. Wait for daily auto-refresh at 3 AM IST
4. Check leaderboard (coming soon!)

---

**Questions?** Check `CODING_PROFILES_GUIDE.md` for detailed documentation.
