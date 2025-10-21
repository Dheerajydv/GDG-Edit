# 🚀 Quick Start Guide - Event Registration System

## Prerequisites
- MongoDB running locally or MongoDB Atlas connection
- Node.js installed
- Admin account created in database

---

## Step 1: Start Backend Server

```powershell
cd backend
npm install  # If not already done
npm run dev
```

**Expected Output**:
```
✅ MongoDB Connected: gdg_mmmut
🚀 Server running on port 5000
```

---

## Step 2: Start Frontend Development Server

```powershell
cd frontend
npm install  # If not already done
npm run dev
```

**Expected Output**:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## Step 3: Create Your First Event

1. **Login as Admin**:
   - Go to `http://localhost:5173/auth`
   - Login with admin credentials
   
2. **Navigate to Admin Events**:
   - Go to `http://localhost:5173/admin/events`
   - Click **"Create Event"** button

3. **Fill Event Details**:
   ```
   Name: Google Cloud Workshop
   Type: Workshop
   Description: Learn Google Cloud Platform basics
   Date: [Select future date]
   Time: 2:00 PM - 5:00 PM
   Location: MMMUT Campus, Computer Center
   Capacity: 50
   Registration Open: ✅ Yes
   Published: ✅ Yes
   ```

4. **Submit** → Event created! ✅

---

## Step 4: View Event on Public Page

1. **Open Events Page**:
   - Go to `http://localhost:5173/events`
   
2. **Verify Event Appears**:
   - Your event should be visible in the "Upcoming" section
   - Shows: Title, Date, Location, Capacity (0/50)

---

## Step 5: Test User Registration

### A. Create User Account (if needed)
1. Logout (if logged in as admin)
2. Go to `http://localhost:5173/auth`
3. Click "Sign Up"
4. Create regular user account

### B. Register for Event
1. Login as regular user
2. Go to `/events`
3. Find your event
4. Click **"Register"** button
5. Fill the 3-step form:
   
   **Step 1 - Personal Info**:
   ```
   Full Name: John Doe
   Email: john@example.com
   Phone: 9876543210
   ```
   
   **Step 2 - Academic Info**:
   ```
   College: MMMUT
   Year: 3rd Year
   Branch: Computer Science
   ```
   
   **Step 3 - Additional**:
   ```
   Reason: Want to learn cloud technologies
   ```

6. Click **"Submit Registration"**
7. Success message appears! ✅

---

## Step 6: Verify Registration

### Check User Dashboard
1. Go to `http://localhost:5173/dashboard/events`
2. See registered event under "Upcoming Events"
3. QR code displayed
4. Registration status shows "Approved"

### Check Database
```javascript
// In MongoDB or MongoDB Compass
db.registrations.find().pretty()
db.events.findOne({ name: "Google Cloud Workshop" })
// registeredCount should be 1
```

---

## Step 7: Admin Views Registration

1. **Login as Admin** again
2. **Go to Registrations**:
   - Navigate to `http://localhost:5173/admin/registrations`

3. **Verify Dashboard**:
   ```
   📊 Statistics:
   - Total Registrations: 1
   - Approved: 1
   - Pending: 0
   - Rejected: 0
   ```

4. **Check Registrations Table**:
   - Should show John Doe's registration
   - Event: Google Cloud Workshop
   - Contact: john@example.com, 9876543210
   - College: MMMUT - 3rd Year - Computer Science
   - Status: Approved

5. **Test Actions**:
   - Click "View" (👁️) to see full details
   - See QR code in modal
   - Change status using dropdown
   - Try search filter: Type "John"
   - Try event filter: Select your event

---

## Step 8: Test CSV Export

1. In **Admin Registrations** page
2. Click **"Export CSV"** button
3. File downloads: `registrations_YYYY-MM-DD.csv`
4. Open in Excel/Google Sheets
5. Verify all data present

---

## Common Issues & Solutions

### Issue 1: Events not showing on public page
**Solution**:
- Check event has `published: true`
- Check event has `draft: false`
- Verify MongoDB connection
- Check browser console for API errors

### Issue 2: Registration fails with "Please login"
**Solution**:
- Ensure user is logged in
- Check JWT token in localStorage: `localStorage.getItem('token')`
- Token must be valid (not expired)

### Issue 3: Admin panel shows "No registrations"
**Solution**:
- Ensure at least one registration exists
- Check filters (might be filtering out data)
- Clear all filters and search
- Verify MongoDB has registration documents

### Issue 4: CORS errors in console
**Solution**:
- Check `ALLOWED_ORIGINS` in backend `.env`
- Ensure `http://localhost:5173` is included
- Restart backend after .env changes

---

## API Testing with Thunder Client / Postman

### Test Public Events API
```http
GET http://localhost:5000/api/events
```

**Expected Response**:
```json
{
  "success": true,
  "count": 1,
  "events": [
    {
      "_id": "...",
      "name": "Google Cloud Workshop",
      "type": "Workshop",
      "date": "2025-11-15",
      "registeredCount": 1,
      "capacity": 50
    }
  ]
}
```

### Test User Registration (Requires Auth)
```http
POST http://localhost:5000/api/registrations
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "eventId": "EVENT_ID_HERE",
  "formData": {
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543211",
    "college": "MMMUT",
    "year": "2nd Year",
    "branch": "IT"
  }
}
```

### Test Admin Get Registrations (Requires Admin Auth)
```http
GET http://localhost:5000/api/admin/registrations
Authorization: Bearer ADMIN_JWT_TOKEN
```

---

## MongoDB Queries for Debugging

### View All Events
```javascript
db.events.find({}).pretty()
```

### View Published Events Only
```javascript
db.events.find({ published: true, draft: false }).pretty()
```

### View All Registrations with Details
```javascript
db.registrations.find({})
  .populate('user')
  .populate('event')
  .pretty()
```

### Count Registrations per Event
```javascript
db.registrations.aggregate([
  {
    $group: {
      _id: "$event",
      count: { $sum: 1 }
    }
  }
])
```

### Find Registrations by User Email
```javascript
db.registrations.find({
  "formData.email": "john@example.com"
}).pretty()
```

---

## Production Deployment Checklist

Before deploying to production:

### Backend (Vercel)
- [ ] Set all environment variables in Vercel
- [ ] `MONGODB_URI` points to production database
- [ ] `FRONTEND_URL` set to production frontend URL
- [ ] `ALLOWED_ORIGINS` includes production frontend
- [ ] `JWT_SECRET` is strong and secure
- [ ] Deploy backend to Vercel

### Frontend (Vercel)
- [ ] `.env.production` has correct `VITE_API_URL`
- [ ] Test build locally: `npm run build`
- [ ] Deploy frontend to Vercel

### Database
- [ ] MongoDB Atlas production cluster created
- [ ] Database user created with proper permissions
- [ ] IP whitelist configured (allow all for serverless)
- [ ] Connection string updated in backend env vars

### OAuth (if using)
- [ ] Google OAuth callback URLs updated
- [ ] GitHub OAuth callback URLs updated

### Testing
- [ ] Create test event in production
- [ ] Test registration flow end-to-end
- [ ] Verify admin panel loads
- [ ] Test all filters and exports
- [ ] Check mobile responsiveness

---

## Success Indicators ✅

You know everything is working when:

1. ✅ Events appear on public page from database
2. ✅ User can register (receives success message)
3. ✅ Registration appears in user dashboard with QR code
4. ✅ Event's registered count increments
5. ✅ Admin can see registration in admin panel
6. ✅ Admin can change registration status
7. ✅ CSV export contains data
8. ✅ No errors in browser console
9. ✅ No errors in backend terminal

---

## Support & Documentation

- **Full Flow Documentation**: See `EVENT_REGISTRATION_FLOW.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **API Endpoints**: Check backend routes files
- **Frontend Components**: Browse `frontend/src/pages/` and `frontend/src/components/`

---

## Next Steps

1. ✅ **Create More Events**: Populate your events page
2. ✅ **Test Different Scenarios**: 
   - Event at capacity
   - Closed registration
   - Past events
3. ✅ **Customize UI**: Update styles to match your branding
4. ✅ **Add Email Notifications**: Integrate SendGrid/NodeMailer
5. ✅ **Deploy to Production**: Follow deployment checklist above

---

**🎉 Congratulations! Your event registration system is fully operational!**

Your events are now stored in the database and properly displayed with working registration flow and admin management portal.
