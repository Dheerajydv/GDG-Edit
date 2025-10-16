# 🔧 Fix Git Secret Scanning Issue

## Problem
GitHub is blocking your push because commit `aee12051` contains OAuth secrets in:
- `DEPLOYMENT_GUIDE.md:69-70`
- `QUICK_DEPLOY_CHECKLIST.md:45-46`

## Solution: Amend the Previous Commit

Since there are no new changes, we need to rewrite the commit that contains secrets.

### Option 1: Reset and Recommit (Easiest)

Run these commands in your terminal (PowerShell):

```powershell
# Navigate to project directory
cd "c:\Users\priya\OneDrive\Desktop\GDG\GDG ka khel"

# Reset to the commit before the bad one (keeps all your files)
git reset --soft HEAD~1

# Now stage all files again (the fixed versions are already in place)
git add .

# Create a new commit without secrets
git commit -m "Configure production deployment with CORS and OAuth

- Enhanced backend CORS for multiple origins
- Created Vercel deployment configuration
- Added environment variables for prod/dev
- Built centralized API utility with auth interceptors
- Updated all API calls to use dynamic URLs
- Fixed OAuth redirects for production
- Documentation uses placeholders for secrets

All code ready for Vercel deployment. No secrets included."

# Push to GitHub
git push origin main
```

### Option 2: If Option 1 Doesn't Work - Force Push

If you've already pushed and need to rewrite history:

```powershell
cd "c:\Users\priya\OneDrive\Desktop\GDG\GDG ka khel"

# Reset to before the bad commit
git reset --soft HEAD~1

# Stage and commit again
git add .
git commit -m "Configure production deployment (no secrets)"

# Force push (⚠️ only if you're the only one working on this branch)
git push -f origin main
```

### Option 3: Use GitHub's Allow Secret Link

If you want to keep the commit as-is and just bypass the check (NOT RECOMMENDED):

1. Click this link: https://github.com/priyanshu-1006/GDG-Edit/security/secret-scanning/unblock-secret/34AC2xUAGPghwvlR3eTsqWPpP4g
2. Click "Allow secret"
3. Do the same for the second secret
4. Push again

**⚠️ WARNING:** Option 3 is NOT secure! Your secrets will be in Git history forever.

## Verification

After fixing, verify the files don't have secrets:

```powershell
# Check the files
cat DEPLOYMENT_GUIDE.md | Select-String "733088255095"
cat QUICK_DEPLOY_CHECKLIST.md | Select-String "733088255095"

# Should return nothing
```

## What We Already Fixed

The current versions of these files now have:
- ✅ Placeholders instead of real secrets: `<your-google-client-id>`
- ✅ Instructions to get secrets from proper sources
- ✅ No hardcoded OAuth credentials

## Why This Happened

The files were created with real secrets, committed, and GitHub detected them. Even though we updated the files, the old commit still exists in history with the secrets.

---

**Recommended Action:** Use Option 1 (reset and recommit)
