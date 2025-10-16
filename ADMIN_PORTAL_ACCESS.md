# 🔐 Admin Portal Access Guide

## Admin User Credentials

**Email:** `admin@gdg.com`  
**Password:** `admin@123`  
**Role:** `super_admin`

---

## 🚀 Accessing the Admin Portal

1. **Start the servers** (if not already running):
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Login to the application**:
   - Go to `http://localhost:5173`
   - Click "Login" or go to `http://localhost:5173/auth`
   - Use the credentials above

3. **Access Admin Portal**:
   - Once logged in, navigate to `http://localhost:5173/admin`
   - Or manually type the URL in browser

---

## 🎯 Admin Portal Features

### Available Now:
- ✅ **Dashboard** - Overview statistics, quick stats, quick actions
- ✅ **Users Management** - View, search, filter, suspend/unsuspend, export CSV
- 🚧 **Events** - Coming soon
- 🚧 **Registrations** - Coming soon
- 🚧 **Notifications** - Coming soon
- 🚧 **Certificates** - Coming soon
- 🚧 **Teams** - Coming soon
- 🚧 **Analytics** - Coming soon
- 🚧 **Settings** - Coming soon

### User Management Features:
- Search users by name or email
- Filter by role (student, event_manager, admin, super_admin)
- Suspend/unsuspend user accounts
- Export all users to CSV
- View user statistics (events registered, attended, certificates)
- Pagination support

---

## 🔧 Creating Additional Admin Users

### Method 1: Using the Setup API (One-time only)
```bash
# POST to http://localhost:5000/api/setup/create-admin
# Only works if no admin exists yet

curl -X POST http://localhost:5000/api/setup/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@gdg.com",
    "password": "password123",
    "role": "admin"
  }'
```

### Method 2: Promote Existing User
```bash
# POST to http://localhost:5000/api/setup/promote-to-admin

curl -X POST http://localhost:5000/api/setup/promote-to-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "existing@user.com",
    "role": "super_admin",
    "secretKey": "gdg-super-secret-2024"
  }'
```

### Method 3: Using Scripts
```bash
# Interactive script
cd backend
npm run create-admin

# Quick script (one command)
npm run quick-admin "Name" "email@example.com" "password" "role"

# Example:
npm run quick-admin "John Admin" "john@gdg.com" "pass123" "admin"
```

---

## 🔑 Admin Roles Explained

| Role | Permissions |
|------|-------------|
| **student** | Regular user, can register for events |
| **event_manager** | Can create events, approve registrations, mark attendance |
| **admin** | Full admin access except user role changes |
| **super_admin** | Complete access including role management |

---

## 📡 Backend API Endpoints

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/activity` - Get recent activity feed
- `GET /api/admin/dashboard/charts` - Get chart data

### Users
- `GET /api/admin/users` - List all users (with filters)
- `GET /api/admin/users/:id` - Get user details
- `POST /api/admin/users` - Create new user (super_admin only)
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user (super_admin only)
- `PATCH /api/admin/users/:id/role` - Change user role (super_admin only)
- `PATCH /api/admin/users/:id/suspend` - Suspend/unsuspend user
- `GET /api/admin/users/export` - Export users to CSV

### Events
- `GET /api/admin/events` - List all events
- `GET /api/admin/events/:id` - Get event details
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `PATCH /api/admin/events/:id/publish` - Publish/unpublish event
- `POST /api/admin/events/:id/duplicate` - Duplicate event
- `GET /api/admin/events/:id/analytics` - Get event analytics

### Registrations
- `GET /api/admin/registrations` - List all registrations
- `PATCH /api/admin/registrations/:id/approve` - Approve registration
- `PATCH /api/admin/registrations/:id/reject` - Reject registration
- `POST /api/admin/registrations/bulk-approve` - Bulk approve
- `PATCH /api/admin/registrations/:id/attendance` - Mark attendance
- `POST /api/admin/registrations/scan-qr` - QR code attendance
- `GET /api/admin/registrations/export` - Export to CSV

### Notifications
- `GET /api/admin/notifications` - List notifications
- `POST /api/admin/notifications` - Create notification
- `POST /api/admin/notifications/:id/send` - Send notification
- `PATCH /api/admin/notifications/:id/schedule` - Schedule notification
- `DELETE /api/admin/notifications/:id` - Delete notification
- `GET /api/admin/notifications/stats` - Get notification stats

---

## 🛡️ Security Notes

1. **Change default password** - Make sure to change the default admin password in production
2. **Secret key** - Set a strong `ADMIN_SECRET_KEY` in your `.env` file
3. **Access control** - All admin routes are protected with JWT authentication
4. **Role-based permissions** - Different roles have different access levels
5. **Activity logging** - All admin actions are logged for audit trail

---

## 🐛 Troubleshooting

### Can't access /admin route
- Make sure you're logged in
- Check that your user has admin role (admin, event_manager, or super_admin)
- Check browser console for errors

### API returns 401 Unauthorized
- Token expired, login again
- Check that token is being sent in Authorization header

### API returns 403 Forbidden
- Your role doesn't have permission for this action
- Contact super_admin to change your role

---

## 📝 TODO

- [ ] Complete remaining admin pages (Events, Registrations, Notifications, etc.)
- [ ] Add charts/graphs to dashboard (Recharts)
- [ ] Implement email notifications (nodemailer)
- [ ] Add QR code generation for registrations
- [ ] Build analytics dashboard with detailed reports
- [ ] Add bulk actions for users
- [ ] Implement advanced filters
- [ ] Add export functionality for all data

---

**Last Updated:** October 16, 2025  
**Version:** 1.0.0
