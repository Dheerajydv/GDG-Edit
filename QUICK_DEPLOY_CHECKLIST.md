# 🚀 Quick Deployment Checklist

## ✅ COMPLETED
- [x] Backend CORS configuration updated
- [x] Frontend environment variables configured  
- [x] API calls use dynamic URLs from environment
- [x] OAuth redirects use production URLs
- [x] Vercel configuration files created

## ⚠️ CRITICAL - DO THIS NOW!

### 1. Update OAuth Settings (5 minutes)

**Google OAuth:**
1. Visit: https://console.cloud.google.com/apis/credentials
2. Click your OAuth Client ID
3. Add to "Authorized redirect URIs":
   ```
   https://gdg-backend-ten.vercel.app/api/auth/google/callback
   ```
4. Click "Save"

**GitHub OAuth:**
1. Visit: https://github.com/settings/developers
2. Click your OAuth App
3. Update "Authorization callback URL":
   ```
   https://gdg-backend-ten.vercel.app/api/auth/github/callback
   ```
4. Click "Update application"

### 2. Set Vercel Environment Variables (10 minutes)

**Backend Project** (gdg-backend-ten.vercel.app):
```
Settings > Environment Variables > Add New
```

**⚠️ IMPORTANT:** Get your actual secrets from:
- MongoDB: Your MongoDB Atlas connection string
- Google OAuth: Google Cloud Console
- GitHub OAuth: GitHub Developer Settings
- Generate random strings for JWT_SECRET and SESSION_SECRET

Required variables (use your real values from backend/.env):
```env
NODE_ENV=production
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
GOOGLE_CALLBACK_URL=https://gdg-backend-ten.vercel.app/api/auth/google/callback
GITHUB_CLIENT_ID=<from-github-settings>
GITHUB_CLIENT_SECRET=<from-github-settings>
GITHUB_CALLBACK_URL=https://gdg-backend-ten.vercel.app/api/auth/github/callback
FRONTEND_URL=https://gdg-frontend-seven.vercel.app
ALLOWED_ORIGINS=https://gdg-frontend-seven.vercel.app,http://localhost:5173
SESSION_SECRET=<generate-random-string>
CLOUDINARY_CLOUD_NAME=<optional>
CLOUDINARY_API_KEY=<optional>
CLOUDINARY_API_SECRET=<optional>
```

**Frontend Project** (gdg-frontend-seven.vercel.app):
```
Settings > Environment Variables > Add New
```

Add these 2 variables:
```env
VITE_API_URL=https://gdg-backend-ten.vercel.app
VITE_FRONTEND_URL=https://gdg-frontend-seven.vercel.app
```

### 3. Redeploy (2 minutes)

**Backend:**
1. Go to backend project in Vercel
2. Deployments tab
3. Click "..." on latest deployment
4. Click "Redeploy"

**Frontend:**
1. Go to frontend project in Vercel  
2. Deployments tab
3. Click "..." on latest deployment
4. Click "Redeploy"

### 4. Test (5 minutes)

Open: https://gdg-frontend-seven.vercel.app

Test these:
- [ ] Homepage loads
- [ ] Events page shows events
- [ ] Click "Sign in with Google" → redirects → comes back with login
- [ ] Admin login works (admin@gdg.com / admin@123)
- [ ] Admin dashboard shows stats

## 🔧 If Something Breaks

### CORS Error
- Check backend Vercel logs: `Deployments > View Function Logs`
- Look for "❌ Blocked by CORS" messages
- Verify `ALLOWED_ORIGINS` includes `https://gdg-frontend-seven.vercel.app`

### OAuth Error  
- Check callback URL in OAuth provider EXACTLY matches:
  `https://gdg-backend-ten.vercel.app/api/auth/google/callback`
- No trailing slashes!
- HTTPS not HTTP!

### API Not Working
- Check backend is deployed: https://gdg-backend-ten.vercel.app/health
- Should return JSON: `{"status":"OK",...}`
- Check frontend environment variables are set
- Check browser console Network tab for actual URL being called

### Events Not Showing
- Check: https://gdg-backend-ten.vercel.app/api/events
- Should return: `{"success":true,"count":N,"events":[...]}`
- If 500 error, check MongoDB connection in backend logs

## 📞 Need Help?

Check browser console (F12) for errors, and Vercel deployment logs for backend errors.

---

**Time Estimate:** 20-25 minutes total
**Difficulty:** Easy (copy your secrets from .env and paste in Vercel)
