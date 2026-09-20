# Quick Deployment Script for GitHub Pages
# Run this after you've set up your GitHub repository

Write-Host "`n🚀 GitHub Pages Deployment Helper`n" -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: Wheel of Fortune game"
}

# Ask for GitHub username
Write-Host "Enter your GitHub username:" -ForegroundColor Cyan
$username = Read-Host

# Update package.json with correct homepage
Write-Host "`nUpdating homepage URL..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw
$packageJson = $packageJson -replace '"homepage": "https://YOUR_GITHUB_USERNAME\.github\.io/WheelOfFortune"', "`"homepage`": `"https://$username.github.io/WheelOfFortune`""
$packageJson | Set-Content "package.json" -NoNewline

Write-Host "✓ Homepage updated to: https://$username.github.io/WheelOfFortune" -ForegroundColor Green

# Ask if remote is already set
Write-Host "`nHave you created a GitHub repository named 'WheelOfFortune'? (y/n)" -ForegroundColor Cyan
$created = Read-Host

if ($created -eq 'y') {
    Write-Host "`nAdding remote origin..." -ForegroundColor Yellow
    try {
        git remote add origin "https://github.com/$username/WheelOfFortune.git" 2>$null
    } catch {
        Write-Host "Remote already exists, skipping..." -ForegroundColor Gray
    }

    Write-Host "`nPushing to main branch..." -ForegroundColor Yellow
    git branch -M main
    git push -u origin main

    Write-Host "`n🎯 Deploying to GitHub Pages..." -ForegroundColor Cyan
    npm run deploy

    Write-Host "`n✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "`nYour game will be live at:" -ForegroundColor Cyan
    Write-Host "https://$username.github.io/WheelOfFortune`n" -ForegroundColor White
    Write-Host "Wait 1-2 minutes, then visit the URL above!" -ForegroundColor Yellow
} else {
    Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor White
    Write-Host "2. Repository name: WheelOfFortune" -ForegroundColor White
    Write-Host "3. Make it Public" -ForegroundColor White
    Write-Host "4. Click 'Create repository'" -ForegroundColor White
    Write-Host "5. Run this script again and answer 'y'`n" -ForegroundColor White
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

