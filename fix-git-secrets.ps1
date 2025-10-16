# Fix Git Secrets Issue - Run this script in Git Bash or VS Code terminal

Write-Host "🔧 Fixing Git Secret Scanning Issue..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Yellow

# Navigate to project root
Set-Location "c:\Users\priya\OneDrive\Desktop\GDG\GDG ka khel"
Write-Host "Changed to project directory" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Resetting to commit before the bad one (keeps all files)..." -ForegroundColor Cyan
# This will undo the last commit but keep all the file changes
# git reset --soft HEAD~1

Write-Host ""
Write-Host "⚠️ IMPORTANT: Run these commands manually in VS Code's terminal (Ctrl+`):" -ForegroundColor Yellow
Write-Host ""
Write-Host "cd `"c:\Users\priya\OneDrive\Desktop\GDG\GDG ka khel`"" -ForegroundColor White
Write-Host "git reset --soft HEAD~1" -ForegroundColor White
Write-Host "git add ." -ForegroundColor White
Write-Host 'git commit -m "Configure production deployment (no secrets)"' -ForegroundColor White
Write-Host "git push origin main" -ForegroundColor White
Write-Host ""
Write-Host "✅ This will create a new commit without the secrets!" -ForegroundColor Green
