# Automated Deployment Script for u3244219
# Wheel of Fortune Game to GitHub Pages
Write-Host ""
Write-Host "Deploying Wheel of Fortune to GitHub Pages" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    git config user.name "u3244219"
    git config user.email "u3244219@uel.ac.uk"
    git add .
    git commit -m "Initial commit: Wheel of Fortune game with 13 categories and 2600+ words"
    Write-Host "Git repository initialized" -ForegroundColor Green
    Write-Host ""
}
$remotes = git remote 2>$null
if ($remotes -notcontains "origin") {
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/u3244219/WheelOfFotune.git
    Write-Host "Remote added" -ForegroundColor Green
    Write-Host ""
}
Write-Host "Pushing to GitHub main branch..." -ForegroundColor Yellow
git branch -M main
git push -u origin main
Write-Host ""
Write-Host "Deploying to GitHub Pages..." -ForegroundColor Cyan
Set-Location frontend
npm run deploy
Write-Host ""
Write-Host "DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "Your game will be live at:" -ForegroundColor Cyan
Write-Host "https://u3244219.github.io/WheelOfFotune" -ForegroundColor White
Write-Host ""
Write-Host "Wait 1-2 minutes, then visit the URL above!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
