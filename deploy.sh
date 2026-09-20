#!/bin/bash
# Automated Deployment Script for u3244219
# Wheel of Fortune Game to GitHub Pages

echo ""
echo "🚀 Deploying Wheel of Fortune to GitHub Pages"
echo "================================================"
echo ""

# Navigate to the project root
cd "$(dirname "$0")/.."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git config user.name "u3244219"
    git config user.email "u3244219@uel.ac.uk"
    git add .
    git commit -m "Initial commit: Wheel of Fortune game with 13 categories and 2600+ words"
    echo "✓ Git repository initialized"
    echo ""
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/u3244219/WheelOfFotune.git
    echo "✓ Remote added"
    echo ""
fi

# Push to main branch
echo "📤 Pushing to GitHub main branch..."
git branch -M main
git push -u origin main

# Deploy to GitHub Pages
echo ""
echo "🎯 Deploying to GitHub Pages..."
cd frontend
npm run deploy

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "Your game will be live at:"
echo "https://u3244219.github.io/WheelOfFotune"
echo ""
echo "Wait 1-2 minutes, then visit the URL above!"
echo ""

