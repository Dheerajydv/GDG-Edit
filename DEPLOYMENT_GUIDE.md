# 🚀 Deployment Guide - GDG MMMUT Website

## Important: Secrets Management

**⚠️ NEVER commit real OAuth secrets to Git!**

All sensitive credentials should be:
- Stored in `.env` files (which are gitignored)
- Set as environment variables in Vercel dashboard
- Never hardcoded in documentation files

## Environment Variables Setup

### Backend Environment Variables (Vercel)

Go to your backend project settings in Vercel and add these variables:

```env
NODE_ENV=production
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<generate-a-strong-random-secret>
JWT_EXPIRE=7d

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_CALLBACK_URL=https://gdg-backend-ten.vercel.app/api/auth/google/callback

# GitHub OAuth (Get from GitHub Developer Settings)
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
GITHUB_CALLBACK_URL=https://gdg-backend-ten.vercel.app/api/auth/github/callback

# Frontend URL
FRONTEND_URL=https://gdg-frontend-seven.vercel.app

# CORS Configuration
ALLOWED_ORIGINS=https://gdg-frontend-seven.vercel.app,http://localhost:5173

# Session Secret (Generate a random string)
SESSION_SECRET=<generate-a-strong-random-secret>

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
```

### Frontend Environment Variables (Vercel)

```env
VITE_API_URL=https://gdg-backend-ten.vercel.app
VITE_FRONTEND_URL=https://gdg-frontend-seven.vercel.app
```

## OAuth Setup Instructions

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Add authorized redirect URI:
   - `https://gdg-backend-ten.vercel.app/api/auth/google/callback`
7. Copy Client ID and Client Secret
8. Add them to Vercel environment variables

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - Homepage URL: `https://gdg-frontend-seven.vercel.app`
   - Authorization callback URL: `https://gdg-backend-ten.vercel.app/api/auth/github/callback`
4. Copy Client ID and Client Secret
5. Add them to Vercel environment variables

## Deployment Steps

1. **Push code to GitHub** (without secrets!)
2. **Set up Vercel projects**:
   - Import backend repo → Deploy
   - Import frontend repo → Deploy
3. **Add environment variables** in Vercel dashboard
4. **Update OAuth callback URLs** in Google/GitHub
5. **Redeploy** both projects
6. **Test** the deployment

## Testing Checklist

- [ ] Homepage loads
- [ ] Events API works: `https://gdg-backend-ten.vercel.app/api/events`
- [ ] Health check: `https://gdg-backend-ten.vercel.app/health`
- [ ] Google OAuth login works
- [ ] GitHub OAuth login works
- [ ] Admin portal accessible
- [ ] No CORS errors in browser console

## Troubleshooting

### CORS Errors
- Check `ALLOWED_ORIGINS` includes your frontend URL
- Verify backend is using production URLs
- Check browser console for actual error message

### OAuth Errors
- Verify callback URLs match exactly (no trailing slashes)
- Check OAuth credentials are correct in Vercel
- Ensure OAuth apps are configured for production URLs

### API Not Working
- Check Vercel deployment logs
- Verify MongoDB connection string
- Test health endpoint first
- Check all environment variables are set

## Security Best Practices

1. **Never commit secrets** to Git
2. **Use strong random strings** for JWT_SECRET and SESSION_SECRET
3. **Rotate secrets regularly** if compromised
4. **Use environment variables** for all sensitive data
5. **Enable GitHub secret scanning** (already enabled for you!)

---

For detailed OAuth setup, see: `backend/OAUTH_SETUP.md`
