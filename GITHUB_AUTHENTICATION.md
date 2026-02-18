# GitHub Authentication Setup Guide

## The Issue

When you run `git push`, GitHub requires authentication. You need a Personal Access Token (PAT).

## Quick Setup (5 minutes)

### Step 1: Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click: **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in:
   - **Note**: "WheelOfFortune Deployment"
   - **Expiration**: 90 days (or longer)
   - **Select scopes**: Check these boxes:
     - ✓ `repo` (Full control of private repositories)
     - ✓ `workflow` (Update GitHub Action workflows)
4. Click: **"Generate token"** (green button at bottom)
5. **COPY THE TOKEN IMMEDIATELY** - You won't see it again!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Configure Git Credential Manager

Open PowerShell and run:

```powershell
git config --global credential.helper manager-core
```

### Step 3: Run Deployment

When you run the deployment script, Git will prompt you for credentials:

```
Username for 'https://github.com': u3244219
Password for 'https://u3244219@github.com': [PASTE YOUR TOKEN HERE]
```

**IMPORTANT**: Paste your Personal Access Token (not your password!) when asked for password.

## Alternative: SSH (More Secure, But More Setup)

If you prefer SSH keys instead of tokens:

1. Generate SSH key:
   ```powershell
   ssh-keygen -t ed25519 -C "u3244219@uel.ac.uk"
   ```
2. Add key to GitHub: https://github.com/settings/ssh/new
3. Change remote URL to SSH:
   ```powershell
   git remote set-url origin git@github.com:u3244219/WheelOfFortune.git
   ```

## What Happens Next?

Once authenticated:
1. ✅ Code pushes to GitHub
2. ✅ gh-pages deploys automatically
3. ✅ Your game goes live at: https://u3244219.github.io/WheelOfFortune

## Troubleshooting

**If push fails with "Authentication failed":**
- You used your password instead of the token
- Generate a new token and try again

**If you lost your token:**
- Go back to https://github.com/settings/tokens
- Delete the old token
- Create a new one

**Token stored for future use:**
- Windows Credential Manager saves it
- You won't need to enter it again
- Deployment script will work automatically next time

---

**Ready?** Create your token now at: https://github.com/settings/tokens

