# Spotify Now Playing Setup

This guide will help you set up the dynamic Spotify "Now Playing" widget for your GitHub README.

## Prerequisites

1. **Spotify Account** (Premium recommended for better API access)
2. **Vercel Account** (free tier is sufficient)
3. **GitHub Account** (which you already have)

## ⚡ Quick Alternative: Working Solutions

**Option 1 - Fork Novatorem Repository (Most Reliable):**
1. Go to: https://github.com/novatorem/novatorem
2. Click "Fork" to fork the repository to your account
3. Follow the setup instructions in the README
4. Deploy to Vercel from your forked repo
5. Use your deployed URL in your README

**Option 2 - Use Our Custom Widget (Recommended):**
1. Use the Python script: `python3 spotify_token_generator.py`
2. Deploy to Vercel using the files in this repo
3. Add environment variables to Vercel
4. Use your Vercel URL in README

**Option 3 - Simple Working Badges (No Setup Required):**
Just use these badges (already in your README):
```markdown
[![Spotify](https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white)](https://open.spotify.com/user/BennyThePooh)
```

**Option 4 - Manual Setup:**
Follow the detailed steps below for full control.

---

## Step 1: Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the details:
   - **App Name**: `GitHub README Now Playing`
   - **App Description**: `Dynamic Spotify widget for GitHub profile`
   - **Website**: `https://github.com/Benjination/Benjination`
   - **Redirect URI**: `https://example.com/callback`
5. Check the boxes for Terms of Service
6. Click "Save"
7. Note down your **Client ID** and **Client Secret**

**Note:** We use `https://example.com/callback` as it's secure and the script will handle extracting the code from the URL.

## Step 2: Get Authorization Code

1. Replace `YOUR_CLIENT_ID` in this URL with your actual Client ID:
```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-currently-playing
```

2. Visit the URL in your browser
3. Log in and authorize the app
4. You'll be redirected to `https://example.com/callback?code=AUTHORIZATION_CODE`
5. The page won't load (that's expected!), but look at the URL in your browser's address bar
6. Copy the `AUTHORIZATION_CODE` from the URL parameter

## Step 3: Get Refresh Token

1. Use this curl command (replace YOUR_CLIENT_ID, YOUR_CLIENT_SECRET, and AUTHORIZATION_CODE):

```bash
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE" \
  -d "redirect_uri=https://example.com/callback" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

2. This will return a JSON response with a `refresh_token`. Save this token!

## Step 4: Deploy to Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. In your project directory, run: `vercel`
3. Follow the prompts to deploy
4. Set environment variables in Vercel dashboard:
   - `SPOTIFY_CLIENT_ID`: Your Client ID
   - `SPOTIFY_CLIENT_SECRET`: Your Client Secret  
   - `SPOTIFY_REFRESH_TOKEN`: Your Refresh Token

## Step 5: Update README

Replace the Spotify section in your README with:

```markdown
## 🎵 Now Playing

<div align="center">

[![Spotify](https://your-vercel-app.vercel.app/api/spotify)](https://open.spotify.com/user/BennyThePooh)

</div>
```

Replace `your-vercel-app` with your actual Vercel app domain.

## Testing

Visit `https://your-vercel-app.vercel.app/api/spotify` to see your widget!

## Troubleshooting

- Make sure all environment variables are set correctly in Vercel
- The refresh token doesn't expire, but if you have issues, regenerate it
- Premium Spotify accounts have better API access
- The widget updates every 60 seconds due to caching
