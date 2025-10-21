# 🎯 Event Registration System - Complete Flow Guide

## Overview
This document explains how events are stored in the database, displayed on the public events page, handle registrations, and shown in the admin portal.

---

## 📊 Database Models

### Event Model (`backend/models/Event.js`)
Events are stored with the following key fields:
- **name**: Event title
- **type**: Workshop, Study Jam, Hackathon, Meetup, Conference, Webinar, Tech Fest
- **description**: Event details
- **date** & **time**: When the event occurs
- **location**: Where the event takes place
- **capacity**: Maximum number of participants
- **registeredCount**: Current number of registrations
- **registrationOpen**: Boolean flag to control registration availability
- **published**: Only published events appear on public page
- **image**: Event banner/poster URL
- **tags**: Array of searchable tags
- **eventCategory**: general, study-jam, immerse, hackblitz
- **createdBy**: Admin who created the event

### Registration Model (`backend/models/Registration.js`)
Each registration contains:
- **user**: Reference to User model (who registered)
- **event**: Reference to Event model (which event)
- **status**: approved, pending, rejected, waitlist
- **formData**: { fullName, email, phone, college, year, branch, reason }
- **attended**: Boolean for attendance tracking
- **qrCode**: Generated QR code for check-in
- **certificateIssued**: Boolean flag
- **timestamps**: createdAt, updatedAt

---

## 🔄 Complete Flow

### 1. **Admin Creates Event** (`/admin/events`)

**Frontend**: `frontend/src/pages/Admin/Events.jsx`
- Admin clicks "Create Event" button
- Modal opens: `CreateEventModal.jsx`
- Fills event details (name, date, location, capacity, etc.)
- Submits form

**Backend**: `POST /api/admin/events`
```javascript
// Route: backend/routes/admin.routes.js
router.post('/events', requireEventManager, eventsController.createEvent);

// Creates event in MongoDB with:
{
  name: "Google Cloud Workshop",
  type: "Workshop",
  date: "2025-11-01",
  time: "2:00 PM",
  location: "MMMUT Campus",
  capacity: 100,
  registeredCount: 0,
  published: true, // Admin can set this
  registrationOpen: true,
  createdBy: adminUserId
}
```

---

### 2. **Event Appears on Public Page** (`/events`)

**Frontend**: `frontend/src/pages/Events.jsx`
- Component loads and calls `fetchEvents()`
- Fetches from: `GET /api/events` (public route)

**API Service**: `frontend/src/utils/eventService.js`
```javascript
export const fetchEvents = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/events`);
  // Transforms API data for frontend display
  return response.data.events.map(event => ({
    id: event._id,
    title: event.name,
    date: event.date,
    location: event.location,
    attendees: event.registeredCount,
    capacity: event.capacity,
    registrationOpen: event.registrationOpen,
    // ... other fields
  }));
};
```

**Backend**: `GET /api/events`
```javascript
// Route: backend/routes/event.routes.js
router.get('/', async (req, res) => {
  // Only returns published events
  const events = await Event.find({ 
    published: true, 
    draft: false 
  }).sort({ date: 1 });
  
  res.json({ success: true, events });
});
```

**Display**: Events shown in `EventCard.jsx` components
- Filtered by: All, Upcoming, Past
- Categorized by: Workshop, Conference, Hackathon, etc.
- Shows: Title, Date, Location, Capacity, Registered count

---

### 3. **User Registers for Event**

**Step 1: User Clicks "Register"**
- On EventCard → Opens `RegisterForm.jsx` modal
- User must be **logged in** (JWT token required)

**Step 2: Multi-Step Registration Form**
```javascript
// RegisterForm.jsx - 3 Steps:

// Step 1: Basic Info
- Full Name
- Email
- Phone Number

// Step 2: Academic Info
- College Name
- Year of Study
- Branch/Department

// Step 3: Additional
- Reason for attending (optional)
- Event Summary Review
```

**Step 3: Form Submission**
```javascript
// Frontend: RegisterForm.jsx
const handleSubmit = async () => {
  const token = localStorage.getItem('token');
  
  const registrationData = {
    eventId: event.id,
    formData: {
      fullName, email, phone,
      college, year, branch, reason
    }
  };

  await axios.post(
    `${API_BASE_URL}/api/registrations`,
    registrationData,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
};
```

**Backend**: `POST /api/registrations`
```javascript
// Route: backend/routes/registration.routes.js
router.post('/', protect, async (req, res) => {
  const { eventId, formData } = req.body;
  
  // Validations:
  // 1. Check if event exists
  const event = await Event.findById(eventId);
  
  // 2. Check if registration is open
  if (!event.registrationOpen) {
    return res.status(400).json({ 
      message: 'Registration is closed' 
    });
  }
  
  // 3. Check if event is full
  if (event.registeredCount >= event.capacity) {
    return res.status(400).json({ 
      message: 'Event is full' 
    });
  }
  
  // 4. Check duplicate registration
  const existing = await Registration.findOne({
    user: req.user._id,
    event: eventId
  });
  if (existing) {
    return res.status(400).json({ 
      message: 'Already registered' 
    });
  }
  
  // 5. Generate QR Code
  const qrData = JSON.stringify({
    userId: req.user._id,
    eventId: eventId,
    registrationId: Date.now()
  });
  const qrCode = await QRCode.toDataURL(qrData);
  
  // 6. Create registration
  const registration = await Registration.create({
    user: req.user._id,
    event: eventId,
    formData,
    qrCode,
    status: 'approved' // Auto-approve
  });
  
  // 7. Update event count
  event.registeredCount += 1;
  await event.save();
  
  res.json({ 
    success: true, 
    message: 'Successfully registered',
    registration 
  });
});
```

---

### 4. **User Views Their Registrations** (`/dashboard/events`)

**Frontend**: `frontend/src/pages/Dashboard/MyEvents.jsx`
```javascript
// Fetch user's registered events
const fetchMyEvents = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(
    `${API_BASE_URL}/api/registrations/my-events`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  
  // Separate upcoming vs past events
  setUpcomingEvents(response.data.upcoming);
  setPastEvents(response.data.past);
};
```

**Backend**: `GET /api/registrations/my-events`
```javascript
router.get('/my-events', protect, async (req, res) => {
  const registrations = await Registration
    .find({ user: req.user._id })
    .populate('event')
    .sort({ createdAt: -1 });
    
  const now = new Date();
  const upcoming = registrations.filter(
    r => new Date(r.event.date) >= now
  );
  const past = registrations.filter(
    r => new Date(r.event.date) < now
  );
  
  res.json({ upcoming, past });
});
```

**Display Features**:
- Shows QR code for check-in
- Event details (date, time, location)
- Registration status badge
- Download certificate button (if attended)

---

### 5. **Admin Views All Registrations** (`/admin/registrations`)

**Frontend**: `frontend/src/pages/Admin/Registrations.jsx`

**Features**:

#### 📊 Statistics Dashboard
```javascript
// Real-time stats cards
- Total Registrations
- Approved Count
- Pending Count
- Rejected Count
```

#### 🔍 Advanced Filtering
```javascript
// Filter registrations by:
- Search: Name, Email, Phone
- Event: Dropdown of all events
- Status: All, Approved, Pending, Rejected, Waitlist
```

#### 📋 Comprehensive Table View
Displays all registrations with columns:
- **Participant**: Name + Email
- **Event**: Event name + Date
- **Contact**: Email + Phone with icons
- **College Info**: College + Year/Branch
- **Status**: Dropdown to change status (approved/pending/rejected/waitlist)
- **Registered On**: Timestamp
- **Attended**: Yes/No badge
- **Actions**: View Details button

#### 👁️ Detailed Modal View
Click "View" button to see:
- Complete event information
- Full participant details
- Registration status
- QR Code display
- Reason for attending

#### 📥 Export Functionality
- "Export CSV" button
- Downloads all registrations with complete data
- Filename: `registrations_YYYY-MM-DD.csv`

**Backend**: `GET /api/admin/registrations`
```javascript
// Route: backend/routes/admin.routes.js
router.get('/registrations', registrationsController.getAllRegistrations);

// Controller: backend/controllers/admin/registrationsController.js
export const getAllRegistrations = async (req, res) => {
  const { status, eventId, search } = req.query;
  
  const filter = {};
  if (status) filter.status = status;
  if (eventId) filter.event = eventId;
  
  let registrations = await Registration.find(filter)
    .populate('user', 'name email phone')
    .populate('event', 'name date type')
    .sort({ createdAt: -1 });
  
  // Apply search filter
  if (search) {
    registrations = registrations.filter(reg => 
      reg.user?.name.toLowerCase().includes(search.toLowerCase()) ||
      reg.user?.email.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({ success: true, registrations });
};
```

---

### 6. **Admin Actions on Registrations**

#### Change Status
```javascript
// PATCH /api/admin/registrations/:id/status
await axios.patch(
  `${API_BASE_URL}/api/admin/registrations/${regId}/status`,
  { status: 'approved' }, // or 'rejected', 'waitlist'
  { headers: getAuthHeaders() }
);
```

#### Mark Attendance
```javascript
// PATCH /api/admin/registrations/:id/attendance
router.patch('/:id/attendance', async (req, res) => {
  const registration = await Registration.findByIdAndUpdate(
    req.params.id,
    { 
      attended: true,
      attendanceTime: new Date()
    },
    { new: true }
  );
  
  res.json({ success: true, registration });
});
```

#### Scan QR Code for Check-in
```javascript
// POST /api/admin/registrations/scan-qr
router.post('/scan-qr', async (req, res) => {
  const { qrData } = req.body;
  const data = JSON.parse(qrData);
  
  const registration = await Registration.findOne({
    user: data.userId,
    event: data.eventId
  });
  
  // Mark as attended
  registration.attended = true;
  registration.attendanceTime = new Date();
  await registration.save();
  
  res.json({ success: true, registration });
});
```

---

## 🎨 UI Components

### Public Events Page
**File**: `frontend/src/pages/Events.jsx`
```jsx
<Events>
  <NextEventCountdown /> {/* Shows next upcoming event */}
  <EventFilters /> {/* All, Upcoming, Past, Categories */}
  <EventsList>
    {events.map(event => (
      <EventCard 
        event={event}
        onRegister={() => openRegisterModal(event)}
      />
    ))}
  </EventsList>
  
  {showRegisterModal && (
    <RegisterForm 
      event={selectedEvent}
      onClose={() => setShowRegisterModal(false)}
    />
  )}
</Events>
```

### Admin Registrations Page
**File**: `frontend/src/pages/Admin/Registrations.jsx`
```jsx
<Container>
  <Header>
    <Title>Event Registrations</Title>
    <ExportButton onClick={handleExportCSV} />
  </Header>
  
  <StatsGrid>
    {/* 4 stat cards */}
  </StatsGrid>
  
  <FilterBar>
    <SearchBox />
    <EventFilter />
    <StatusFilter />
  </FilterBar>
  
  <TableContainer>
    <Table>
      {/* All registrations with inline status editing */}
    </Table>
  </TableContainer>
  
  {showDetailModal && (
    <Modal>
      {/* Complete registration details + QR code */}
    </Modal>
  )}
</Container>
```

---

## 🔐 Authentication & Authorization

### Public Routes (No Auth Required)
- `GET /api/events` - List all published events
- `GET /api/events/:id` - View single event details

### Protected Routes (User Auth Required)
- `POST /api/registrations` - Register for event
- `GET /api/registrations/my-events` - View my registrations

### Admin Routes (Admin Role Required)
- `GET /api/admin/events` - All events (including drafts)
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `GET /api/admin/registrations` - All registrations
- `PATCH /api/admin/registrations/:id/status` - Change status
- `PATCH /api/admin/registrations/:id/attendance` - Mark attendance

**Middleware Chain**:
```javascript
// Example: Create event
router.post('/events', 
  protect, // Verify JWT token
  requireEventManager, // Check if user has event manager role
  logActivity('create', 'event'), // Log the action
  eventsController.createEvent // Execute controller
);
```

---

## 🗄️ API Endpoints Summary

### Public Events API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | Get all published events | No |
| GET | `/api/events/:id` | Get single event | No |

### User Registration API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/registrations` | Register for event | User |
| GET | `/api/registrations/my-events` | My registered events | User |

### Admin Events API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/events` | All events | Admin |
| POST | `/api/admin/events` | Create event | Admin |
| PUT | `/api/admin/events/:id` | Update event | Admin |
| DELETE | `/api/admin/events/:id` | Delete event | Admin |
| PATCH | `/api/admin/events/:id/publish` | Toggle publish | Admin |

### Admin Registrations API
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/registrations` | All registrations | Admin |
| PATCH | `/api/admin/registrations/:id/status` | Change status | Admin |
| PATCH | `/api/admin/registrations/:id/attendance` | Mark attendance | Admin |
| POST | `/api/admin/registrations/scan-qr` | QR check-in | Admin |
| GET | `/api/admin/registrations/export` | Export CSV | Admin |

---

## 🚀 Testing the Flow

### Step 1: Create Event (Admin)
1. Login as admin
2. Go to `/admin/events`
3. Click "Create Event"
4. Fill details:
   - Name: "React Workshop 2025"
   - Type: Workshop
   - Date: Future date
   - Capacity: 50
   - Published: ✅
   - Registration Open: ✅
5. Submit → Event saved to database

### Step 2: View on Public Page
1. Go to `/events`
2. Event appears in "Upcoming" section
3. Click on event card
4. See "Register" button (if logged in)

### Step 3: Register as User
1. Login as regular user
2. Click "Register" on event
3. Fill 3-step form
4. Submit → Registration created
5. Event's `registeredCount` increments

### Step 4: View My Registrations
1. Go to `/dashboard/events`
2. See registered event in "Upcoming Events"
3. View QR code for check-in

### Step 5: Admin Manages Registrations
1. Login as admin
2. Go to `/admin/registrations`
3. See all registrations in table
4. Filter by event/status
5. Change status via dropdown
6. Click "View" for details
7. Export CSV for reporting

---

## 🎯 Key Features Implemented

✅ **Event Management**
- CRUD operations for events
- Draft and published states
- Event categories and types
- Registration capacity limits
- Registration deadline

✅ **Registration System**
- Multi-step registration form
- Duplicate registration prevention
- Automatic QR code generation
- Auto-approval (configurable)
- Form validation

✅ **User Dashboard**
- View upcoming/past events
- Display QR codes
- Registration status tracking
- Certificate downloads

✅ **Admin Portal**
- Real-time statistics
- Advanced filtering
- Status management
- Attendance tracking
- CSV export
- Detailed modal views

✅ **Security**
- JWT authentication
- Role-based access control
- Protected routes
- Input validation

---

## 📱 Screenshots Flow

```
1. PUBLIC EVENTS PAGE (/events)
   ┌─────────────────────────────────┐
   │ 🔵 Next Event: React Workshop   │
   │ Countdown: 5 days 3 hrs         │
   └─────────────────────────────────┘
   
   Filters: [All] [Upcoming] [Past]
   
   ┌───────┐ ┌───────┐ ┌───────┐
   │Event 1│ │Event 2│ │Event 3│
   │ 📅 🕐 │ │ 📅 🕐 │ │ 📅 🕐 │
   │👥 25/50│ │👥 10/30│ │👥 Full│
   │[Register]│[Register]│[Closed]│
   └───────┘ └───────┘ └───────┘

2. REGISTRATION MODAL
   ┌─────────────────────────────────┐
   │ Register for React Workshop     │
   │ ●──○──○  (Step 1/3)            │
   ├─────────────────────────────────┤
   │ Full Name: [____________]       │
   │ Email:     [____________]       │
   │ Phone:     [____________]       │
   │                     [Next →]     │
   └─────────────────────────────────┘

3. USER DASHBOARD (/dashboard/events)
   ┌─────────────────────────────────┐
   │ My Registered Events            │
   ├─────────────────────────────────┤
   │ React Workshop                  │
   │ 📅 Nov 15, 2025  ✅ Approved   │
   │ 📍 MMMUT Campus                │
   │ [QR Code]  [View Details]       │
   └─────────────────────────────────┘

4. ADMIN PORTAL (/admin/registrations)
   ┌─────────────────────────────────┐
   │ 📊 Total: 125  ✅ 100  ⏳ 20  ❌ 5│
   ├─────────────────────────────────┤
   │ 🔍 [Search...] [Event▼] [Status▼]│
   │ [📥 Export CSV]                 │
   ├─────────────────────────────────┤
   │ Table with all registrations    │
   │ Status: [Dropdown ▼]            │
   │ Actions: [👁️ View]              │
   └─────────────────────────────────┘
```

---

## 🔧 Configuration

### Environment Variables

**Backend** (`.env`):
```env
MONGODB_URI=mongodb://localhost:27017/gdg_mmmut
JWT_SECRET=your_secret_key
FRONTEND_URL=https://gdg-frontend-seven.vercel.app
ALLOWED_ORIGINS=https://gdg-frontend-seven.vercel.app,http://localhost:5173
```

**Frontend** (`.env.production`):
```env
VITE_API_URL=https://gdg-backend-ten.vercel.app
VITE_FRONTEND_URL=https://gdg-frontend-seven.vercel.app
```

---

## 📚 Additional Resources

- **Event Model**: `backend/models/Event.js`
- **Registration Model**: `backend/models/Registration.js`
- **Event Routes**: `backend/routes/event.routes.js`
- **Registration Routes**: `backend/routes/registration.routes.js`
- **Admin Routes**: `backend/routes/admin.routes.js`
- **Event Service**: `frontend/src/utils/eventService.js`
- **API Utils**: `frontend/src/utils/apiUtils.js`

---

## ✅ Summary

The complete event registration system provides:

1. **For Admins**: Full control over events and registrations with analytics
2. **For Users**: Easy event discovery and registration with QR codes
3. **For Everyone**: Real-time data updates and seamless user experience

All data is stored in MongoDB and properly synchronized between the frontend and backend! 🎉
