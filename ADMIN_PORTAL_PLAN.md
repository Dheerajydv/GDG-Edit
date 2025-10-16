# 🛡️ GDG Admin Portal - Complete Implementation Plan

## 📋 Table of Contents
1. [Overview](#overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Admin Portal Structure](#admin-portal-structure)
4. [Features Breakdown](#features-breakdown)
5. [Database Schema Updates](#database-schema-updates)
6. [Backend API Endpoints](#backend-api-endpoints)
7. [Frontend Component Structure](#frontend-component-structure)
8. [UI/UX Design](#uiux-design)
9. [Implementation Phases](#implementation-phases)
10. [Security Considerations](#security-considerations)

---

## 🎯 Overview

The Admin Portal is a comprehensive dashboard for GDG administrators to manage:
- **Students/Users** - View, edit, verify, promote, suspend users
- **Events** - Create, edit, publish, delete events
- **Registrations** - Approve/reject, check attendance, export data
- **Notifications/Alerts** - Send announcements, email blasts
- **Study Jams** - Monitor progress, assign tasks
- **Certificates** - Generate, issue, revoke
- **Teams** - Manage team competitions
- **Analytics** - View statistics, reports, charts

---

## 👥 User Roles & Permissions

### Current Roles (in User model):
```javascript
role: ['student', 'admin', 'event_manager', 'super_admin']
```

### Permission Matrix:

| Feature | Student | Event Manager | Admin | Super Admin |
|---------|---------|---------------|-------|-------------|
| **Dashboard Access** | ❌ | ✅ | ✅ | ✅ |
| **View Users** | ❌ | ❌ | ✅ | ✅ |
| **Edit Users** | ❌ | ❌ | ✅ | ✅ |
| **Delete Users** | ❌ | ❌ | ❌ | ✅ |
| **Promote Users** | ❌ | ❌ | ❌ | ✅ |
| **Create Events** | ❌ | ✅ | ✅ | ✅ |
| **Edit Events** | ❌ | ✅ Own | ✅ All | ✅ All |
| **Delete Events** | ❌ | ❌ | ✅ | ✅ |
| **View Registrations** | Own | ✅ Event | ✅ All | ✅ All |
| **Approve Registrations** | ❌ | ✅ | ✅ | ✅ |
| **Mark Attendance** | ❌ | ✅ | ✅ | ✅ |
| **Issue Certificates** | ❌ | ✅ | ✅ | ✅ |
| **Send Notifications** | ❌ | ✅ Event | ✅ All | ✅ All |
| **View Analytics** | ❌ | ✅ Limited | ✅ Full | ✅ Full |
| **Manage Admins** | ❌ | ❌ | ❌ | ✅ |
| **System Settings** | ❌ | ❌ | ❌ | ✅ |

---

## 🏗️ Admin Portal Structure

```
/admin
├── /dashboard              # Overview & Statistics
├── /users                  # Student Management
│   ├── /all               # List all users
│   ├── /add               # Add new user
│   ├── /edit/:id          # Edit user
│   └── /verify-pending    # Pending verifications
├── /events                 # Event Management
│   ├── /all               # List all events
│   ├── /create            # Create new event
│   ├── /edit/:id          # Edit event
│   └── /drafts            # Draft events
├── /registrations          # Registration Management
│   ├── /all               # All registrations
│   ├── /pending           # Pending approvals
│   ├── /attendance        # Mark attendance
│   └── /export            # Export data
├── /notifications          # Notification Center
│   ├── /create            # Create notification
│   ├── /scheduled         # Scheduled notifications
│   └── /history           # Sent notifications
├── /study-jams             # Study Jam Management
│   ├── /all               # All study jams
│   ├── /progress          # Track progress
│   └── /leaderboard       # Rankings
├── /certificates           # Certificate Management
│   ├── /generate          # Generate certificates
│   ├── /issued            # Issued certificates
│   └── /templates         # Certificate templates
├── /teams                  # Team Management
│   ├── /all               # All teams
│   ├── /competitions      # Team competitions
│   └── /winners           # Winners & rankings
├── /analytics              # Analytics & Reports
│   ├── /overview          # General stats
│   ├── /events            # Event analytics
│   ├── /users             # User analytics
│   └── /engagement        # Engagement metrics
└── /settings               # Admin Settings
    ├── /profile           # Admin profile
    ├── /permissions       # Role management
    └── /system            # System config
```

---

## 🎨 Features Breakdown

### 1. **Dashboard (Overview)**
**Purpose:** Quick overview of key metrics and recent activity

**Components:**
- **Stats Cards:**
  - Total Users (with growth percentage)
  - Active Events (ongoing/upcoming)
  - Pending Registrations
  - Certificates Issued This Month
  
- **Quick Actions:**
  - Create Event
  - Send Notification
  - Approve Registrations
  - Generate Certificates
  
- **Recent Activity Feed:**
  - New user registrations
  - Event registrations
  - Attendance marks
  - Certificate issuances
  
- **Charts:**
  - User growth over time (line chart)
  - Event registrations by type (pie chart)
  - Monthly activity (bar chart)
  - Top events by attendance (horizontal bar)

**API Endpoints:**
```
GET /api/admin/dashboard/stats
GET /api/admin/dashboard/recent-activity
GET /api/admin/dashboard/charts
```

---

### 2. **Student Management**
**Purpose:** Comprehensive user database management

#### 2.1 **All Users View**

**Features:**
- Search by name, email, college
- Filter by:
  - Role (student/admin/event_manager)
  - College
  - Year
  - Branch
  - Registration date range
  - OAuth provider
  - Verification status
  
- Sort by:
  - Name (A-Z, Z-A)
  - Join date (newest/oldest)
  - Last login
  - Events attended
  
- **Table Columns:**
  - Profile Photo
  - Name
  - Email
  - College
  - Year & Branch
  - Role
  - Events Registered
  - Events Attended
  - Join Date
  - Last Active
  - Actions (View, Edit, Delete)
  
- **Bulk Actions:**
  - Export selected to CSV/Excel
  - Send notification to selected
  - Change role for selected
  - Delete selected users

**Data Display:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│ 👥 Student Management                                   🔍 Search: []    │
├─────────────────────────────────────────────────────────────────────────┤
│ Filters: [All Roles ▾] [All Colleges ▾] [All Years ▾] [Clear]          │
├─────────────────────────────────────────────────────────────────────────┤
│ [✓] Photo  Name           Email              College    Year  Role      │
│ ─────────────────────────────────────────────────────────────────────── │
│ [ ] 👤    Priya Kumar     priya@email.com   MMMUT      3rd   Student    │
│ [ ] 👤    John Doe        john@email.com    IIT Delhi  2nd   Admin      │
│ [ ] 👤    Sarah Smith     sarah@email.com   NIT        4th   Student    │
├─────────────────────────────────────────────────────────────────────────┤
│ Showing 1-50 of 1,234 users        [Prev] [1] [2] [3] ... [25] [Next]  │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 2.2 **User Details Modal/Page**

**Sections:**
1. **Personal Information:**
   - Profile photo
   - Name, Email, Phone
   - College, Year, Branch
   - OAuth provider
   - Email verified status
   - Account creation date
   - Last login time
   
2. **Activity:**
   - Events registered (count & list)
   - Events attended (count & list)
   - Certificates earned (count & list)
   - Study jams completed
   - Team memberships
   
3. **Coding Profiles:**
   - LeetCode stats
   - CodeChef stats
   
4. **Actions:**
   - Edit profile
   - Change role
   - Verify email
   - Reset password
   - Suspend account
   - Delete account (with confirmation)

#### 2.3 **Add/Edit User**

**Form Fields:**
- Name *
- Email *
- Password (only for new users)
- Phone
- College
- Year (dropdown: 1-5)
- Branch
- Role (dropdown: student/admin/event_manager/super_admin)
- Email verified (checkbox)
- Profile photo upload

**Validation:**
- Email must be unique
- Password min 8 characters
- Phone number format
- Year between 1-5

**API Endpoints:**
```
GET    /api/admin/users                    # List all users
GET    /api/admin/users/:id                # Get user details
POST   /api/admin/users                    # Create user
PUT    /api/admin/users/:id                # Update user
DELETE /api/admin/users/:id                # Delete user
PATCH  /api/admin/users/:id/role           # Change role
PATCH  /api/admin/users/:id/verify         # Verify email
PATCH  /api/admin/users/:id/suspend        # Suspend account
GET    /api/admin/users/export             # Export users CSV
POST   /api/admin/users/bulk-action        # Bulk operations
```

---

### 3. **Event Management**
**Purpose:** Create, edit, publish, and manage events

#### 3.1 **All Events View**

**Features:**
- Tabs:
  - All Events
  - Published
  - Drafts
  - Past Events
  - Upcoming Events
  
- Search by name, description, tags
- Filter by:
  - Event type (Workshop/Hackathon/Study Jam/etc.)
  - Date range
  - Location
  - Registration status (open/closed)
  - Category (general/study-jam/immerse/hackblitz)
  
- **Card/List View:**
  - Event image
  - Event name
  - Type badge
  - Date & time
  - Location
  - Registrations (X / Capacity)
  - Status (Published/Draft/Closed)
  - Actions (View, Edit, Duplicate, Delete, Publish/Unpublish)

**Grid Layout:**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  [Event Image]  │  │  [Event Image]  │  │  [Event Image]  │
│                 │  │                 │  │                 │
│ Workshop Badge  │  │ Hackathon Badge │  │ Study Jam Badge │
│                 │  │                 │  │                 │
│ Event Name      │  │ Event Name      │  │ Event Name      │
│ 📅 Oct 20, 2025 │  │ 📅 Oct 25, 2025 │  │ 📅 Nov 1, 2025  │
│ 📍 Hall 5       │  │ 📍 Online       │  │ 📍 Lab 3        │
│ 👥 150/200      │  │ 👥 45/50        │  │ 👥 80/100       │
│                 │  │                 │  │                 │
│ [Edit] [Delete] │  │ [Edit] [Delete] │  │ [Edit] [Delete] │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

#### 3.2 **Create/Edit Event**

**Form Structure:**

**Tab 1: Basic Information**
- Event Name *
- Event Type * (dropdown)
- Event Category (general/study-jam/immerse/hackblitz)
- Description * (rich text editor)
- Tags (multi-select chips)
- Image upload (drag & drop or browse)

**Tab 2: Schedule & Location**
- Date * (date picker)
- Time * (time picker)
- Duration (hours)
- Location *
- Venue details (optional)
- Online meeting link (if virtual)

**Tab 3: Registration Settings**
- Capacity * (number)
- Registration open (toggle)
- Registration deadline (date picker)
- Auto-approve registrations (toggle)
- Require approval (toggle)
- Custom registration form fields (dynamic)

**Tab 4: Advanced**
- Published (toggle)
- Draft (toggle)
- Parent event (for sub-events like Immerse)
- Prerequisites (text)
- Resources/Links (list)
- Speaker information (optional)

**Actions:**
- Save as Draft
- Publish Event
- Schedule Publish (date/time)
- Preview
- Cancel

**API Endpoints:**
```
GET    /api/admin/events                   # List all events
GET    /api/admin/events/:id               # Get event details
POST   /api/admin/events                   # Create event
PUT    /api/admin/events/:id               # Update event
DELETE /api/admin/events/:id               # Delete event
PATCH  /api/admin/events/:id/publish       # Publish/unpublish
POST   /api/admin/events/:id/duplicate     # Duplicate event
GET    /api/admin/events/stats             # Event statistics
```

---

### 4. **Registration Management**
**Purpose:** View, approve, and manage event registrations

#### 4.1 **All Registrations View**

**Features:**
- Tabs:
  - All Registrations
  - Pending Approval
  - Approved
  - Rejected
  - Waitlist
  - Attended
  
- Filter by:
  - Event (dropdown)
  - Date range
  - Status
  - User college
  - User year
  
- **Table Columns:**
  - User Photo & Name
  - Email
  - Event Name
  - Registration Date
  - Status (badge)
  - Attended (✓/✗)
  - Certificate Issued (✓/✗)
  - Actions (Approve, Reject, Mark Attended, View Details)
  
- **Bulk Actions:**
  - Approve selected
  - Reject selected
  - Mark attended
  - Send email to selected
  - Export to CSV

**Registration Details Modal:**
- User information
- Event details
- Form responses
- Status history
- QR code (for check-in)
- Actions:
  - Approve/Reject
  - Mark as attended
  - Issue certificate
  - Send email
  - Delete registration

#### 4.2 **Attendance Tracking**

**Features:**
- Select event
- QR code scanner (camera access)
- Manual check-in (search user)
- Bulk upload (CSV import)
- Real-time attendance count
- Export attendance list

**QR Scanner Interface:**
```
┌─────────────────────────────────────────┐
│  📸 Attendance Scanner                  │
├─────────────────────────────────────────┤
│  Event: React Workshop                  │
│  Date: Oct 20, 2025                     │
│  Registered: 150 | Attended: 78         │
├─────────────────────────────────────────┤
│                                         │
│       ┌─────────────────────┐           │
│       │                     │           │
│       │   [QR CAMERA VIEW]  │           │
│       │                     │           │
│       │                     │           │
│       └─────────────────────┘           │
│                                         │
│  Scan QR code or [Manual Search]       │
│                                         │
│  ✅ John Doe - Checked in 10:30 AM     │
│  ✅ Sarah Smith - Checked in 10:32 AM  │
└─────────────────────────────────────────┘
```

**API Endpoints:**
```
GET    /api/admin/registrations            # List registrations
GET    /api/admin/registrations/:id        # Get details
POST   /api/admin/registrations/approve    # Approve registrations
POST   /api/admin/registrations/reject     # Reject registrations
PATCH  /api/admin/registrations/:id/attend # Mark attendance
POST   /api/admin/registrations/scan-qr    # QR code attendance
GET    /api/admin/registrations/export     # Export CSV
POST   /api/admin/registrations/bulk       # Bulk actions
```

---

### 5. **Notification Center**
**Purpose:** Send announcements, emails, and push notifications

#### 5.1 **Create Notification**

**Form:**
- **Type:** (tabs)
  - System Alert (banner on website)
  - Email Blast
  - Push Notification (future)
  - SMS (future)
  
- **Recipients:**
  - All users
  - Specific role (students/admins)
  - Specific event registrants
  - Custom filter (college/year/branch)
  - Individual users (multi-select)
  
- **Content:**
  - Title *
  - Message * (rich text for email, plain for alerts)
  - Priority (Low/Medium/High/Critical)
  - Icon/Image
  - Action button (text + link)
  
- **Schedule:**
  - Send now (immediate)
  - Schedule for later (date/time picker)
  
- **Preview:**
  - See how notification will look
  - Test send (to admin email)

**Alert Types:**
```
┌─────────────────────────────────────────────────────────┐
│ 🔔 System Alert (Top Banner)                           │
│ ⚠️ Important: Registration for React Workshop closes   │
│    in 2 hours! [Register Now]                    [✗]   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 📧 Email Blast                                          │
│ Subject: Exciting News from GDG MMMUT!                 │
│ ─────────────────────────────────────────────────────── │
│ Dear {{name}},                                          │
│                                                         │
│ We're thrilled to announce our upcoming Hackathon!     │
│ [Rich text content...]                                 │
│                                                         │
│ [Register Now Button]                                  │
└─────────────────────────────────────────────────────────┘
```

#### 5.2 **Notification History**

- List of sent notifications
- Status (sent/scheduled/draft/failed)
- Recipients count
- Open rate (for emails)
- Click rate (for links)
- Edit/Delete scheduled notifications

**API Endpoints:**
```
POST   /api/admin/notifications             # Create notification
GET    /api/admin/notifications              # List notifications
GET    /api/admin/notifications/:id          # Get details
PUT    /api/admin/notifications/:id          # Update scheduled
DELETE /api/admin/notifications/:id          # Delete scheduled
GET    /api/admin/notifications/:id/stats    # Get analytics
```

---

### 6. **Study Jam Management**
**Purpose:** Monitor and manage study jam progress

**Features:**
- List all study jams
- View participants
- Track progress (badges earned, labs completed)
- Leaderboard
- Assign/update tasks
- Export progress reports

---

### 7. **Certificate Management**
**Purpose:** Generate and issue certificates

**Features:**
- Select event
- View attendees eligible for certificates
- Bulk generate certificates
- Preview certificates
- Issue individual certificates
- Download/email certificates
- Revoke certificates
- Certificate templates management

---

### 8. **Analytics & Reports**
**Purpose:** Data visualization and insights

**Dashboards:**
1. **User Analytics:**
   - Total users growth chart
   - Users by college (pie chart)
   - Users by year (bar chart)
   - Active vs inactive users
   - New registrations trend
   
2. **Event Analytics:**
   - Events by type
   - Average attendance rate
   - Registration vs attendance
   - Most popular events
   - Event timeline
   
3. **Engagement Metrics:**
   - Active users (daily/weekly/monthly)
   - Event participation rate
   - Certificate completion rate
   - Study jam progress
   
4. **Custom Reports:**
   - Date range selector
   - Export to PDF/Excel
   - Scheduled reports (email)

---

## 🗄️ Database Schema Updates

### New Model: **Notification**
```javascript
{
  title: String,
  message: String,
  type: ['alert', 'email', 'push', 'sms'],
  priority: ['low', 'medium', 'high', 'critical'],
  recipients: {
    type: ['all', 'role', 'event', 'custom', 'individual'],
    filter: {
      role: String,
      eventId: ObjectId,
      colleges: [String],
      years: [Number],
      branches: [String],
      userIds: [ObjectId]
    }
  },
  status: ['draft', 'scheduled', 'sent', 'failed'],
  scheduledFor: Date,
  sentAt: Date,
  createdBy: ObjectId (ref: User),
  stats: {
    totalRecipients: Number,
    opened: Number,
    clicked: Number
  }
}
```

### New Model: **ActivityLog**
```javascript
{
  admin: ObjectId (ref: User),
  action: String, // 'created_event', 'approved_registration', etc.
  resource: String, // 'event', 'user', 'registration'
  resourceId: ObjectId,
  details: Object,
  timestamp: Date
}
```

### Update User Model:
```javascript
{
  // Add new fields
  suspended: { type: Boolean, default: false },
  suspendedAt: Date,
  suspendedBy: ObjectId (ref: User),
  suspensionReason: String,
  lastActive: Date
}
```

---

## 🔐 Security Considerations

1. **Authentication:**
   - Admin-only routes protected by middleware
   - Role-based access control (RBAC)
   - JWT token validation
   
2. **Authorization:**
   - Check user role before allowing actions
   - Event managers can only edit their own events
   - Super admin required for user role changes
   
3. **Audit Logging:**
   - Log all admin actions (ActivityLog model)
   - Track who created/edited/deleted what
   - IP address logging
   
4. **Rate Limiting:**
   - Prevent bulk notification spam
   - Limit API requests per minute
   
5. **Data Validation:**
   - Sanitize inputs
   - Prevent XSS/SQL injection
   - File upload size limits

---

## 📦 Implementation Phases

### **Phase 1: Foundation (Week 1)**
- [ ] Admin layout & navigation
- [ ] Dashboard with basic stats
- [ ] User management (list, view, edit)
- [ ] Role-based middleware

### **Phase 2: Event & Registration Management (Week 2)**
- [ ] Event CRUD operations
- [ ] Event creation form with all fields
- [ ] Registration list & approval
- [ ] Attendance tracking (manual)

### **Phase 3: Notifications (Week 3)**
- [ ] Notification model & API
- [ ] Create notification form
- [ ] Email integration
- [ ] System alerts (top banner)

### **Phase 4: Advanced Features (Week 4)**
- [ ] QR code attendance scanner
- [ ] Certificate generation
- [ ] Analytics dashboard
- [ ] Export functionality (CSV/PDF)

### **Phase 5: Polish & Testing (Week 5)**
- [ ] UI/UX refinements
- [ ] Mobile responsiveness
- [ ] Testing all features
- [ ] Documentation

---

## 🎨 UI/UX Design Principles

1. **Consistent Layout:**
   - Sidebar navigation (collapsible on mobile)
   - Top bar with admin profile & notifications
   - Breadcrumb navigation
   - Consistent spacing & typography
   
2. **Color Coding:**
   - Success: Green (#34A853)
   - Warning: Yellow (#FBBC05)
   - Error: Red (#EA4335)
   - Info: Blue (#4285F4)
   - Neutral: Gray
   
3. **Responsive Design:**
   - Mobile-first approach
   - Tables convert to cards on mobile
   - Touch-friendly buttons
   - Collapsible filters
   
4. **Loading States:**
   - Skeleton loaders
   - Progress indicators
   - Disabled buttons during actions
   
5. **Empty States:**
   - Helpful illustrations
   - Call-to-action buttons
   - Guidance text

---

## 🚀 Quick Start Implementation

Would you like me to proceed with:

1. ✅ **Phase 1: Admin Dashboard Layout & User Management**
2. ⏸️ **Phase 2: Event Management**
3. ⏸️ **Phase 3: Registration Management**
4. ⏸️ **Phase 4: Notification System**

Let me know which phase to start with, or if you'd like me to implement all at once!

---

**Document Version:** 1.0  
**Last Updated:** October 16, 2025  
**Status:** Planning Complete - Ready for Implementation
