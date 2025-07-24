# Quick Spotify Widget Setup (5 minutes)

The easiest way to get a Spotify widget working is to use the Novatorem service.

## Step 1: Use Novatorem (Recommended - No coding required)

1. **Visit**: https://github.com/novatorem/novatorem
2. **Fork the repository** to your GitHub account
3. **Enable GitHub Actions** in your forked repo
4. **Create a Spotify App**:
   - Go to: https://developer.spotify.com/dashboard/
   - Create new app with these settings:
     - Name: `GitHub README Widget`
     - Description: `For GitHub profile widget`
     - Website: `https://github.com/yourusername/novatorem`
     - Redirect URI: `https://example.com`
5. **Add secrets to your forked repo**:
   - Go to Settings → Secrets and variables → Actions
   - Add these secrets:
     - `SPOTIFY_CLIENT_ID`: Your Client ID from step 4
     - `SPOTIFY_CLIENT_SECRET`: Your Client Secret from step 4
     - `SPOTIFY_REFRESH_TOKEN`: Get this from the auth process (see repo instructions)
6. **Add to your profile README**:
   ```markdown
   ![Spotify](https://novatorem-yourusername.vercel.app/api/spotify)
   ```

## Step 2: Alternative - Simple SVG Badge

If you want something that works immediately without setup:

```markdown
[![Spotify](https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white)](https://open.spotify.com/user/BennyThePooh)
```

This creates a clickable Spotify badge that links to your profile.

## Step 3: Deploy Our Custom Widget (Advanced)

If you want to use the custom widget I created for you:

1. **Create Vercel account**: https://vercel.com
2. **Import your repository** to Vercel
3. **Add environment variables** in Vercel dashboard
4. **Deploy** and use the generated URL

The custom widget has these features:
- Album artwork
- Animated pulse when playing
- "Not playing" state
- Beautiful Tokyo Night theme colors
