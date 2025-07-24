#!/usr/bin/env python3
"""
Spotify Token Generator for GitHub README Widget
This script helps you get your Spotify refresh token easily.
"""

import requests
import urllib.parse
import base64
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time

class SpotifyAuthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if '/callback' in self.path:
            # Extract the authorization code
            query = urllib.parse.urlparse(self.path).query
            params = urllib.parse.parse_qs(query)
            
            if 'code' in params:
                self.server.auth_code = params['code'][0]
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(b"""
                <html><body>
                <h1>Success!</h1>
                <p>Authorization code received. You can close this window.</p>
                <script>setTimeout(function(){window.close();}, 3000);</script>
                </body></html>
                """)
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"No authorization code received")
        else:
            self.send_response(404)
            self.end_headers()

def get_spotify_tokens():
    """Get Spotify tokens interactively"""
    
    print("🎵 Spotify GitHub README Token Generator")
    print("=" * 40)
    
    # Get client credentials
    client_id = input("Enter your Spotify Client ID: ").strip()
    client_secret = input("Enter your Spotify Client Secret: ").strip()
    
    if not client_id or not client_secret:
        print("❌ Client ID and Secret are required!")
        return
    
    # Start local server
    server = HTTPServer(('localhost', 8888), SpotifyAuthHandler)
    server.auth_code = None
    
    # Start server in background
    server_thread = threading.Thread(target=server.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    
    # Build authorization URL
    redirect_uri = "http://localhost:8888/callback"
    scope = "user-read-currently-playing user-read-playback-state"
    
    auth_url = f"https://accounts.spotify.com/authorize?" + urllib.parse.urlencode({
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": scope
    })
    
    print(f"\n🌐 Opening browser for Spotify authorization...")
    print(f"If it doesn't open automatically, visit: {auth_url}")
    
    webbrowser.open(auth_url)
    
    # Wait for authorization
    print("\n⏳ Waiting for authorization (this may take a moment)...")
    timeout = 60  # 60 seconds timeout
    start_time = time.time()
    
    while server.auth_code is None and (time.time() - start_time) < timeout:
        time.sleep(1)
    
    server.shutdown()
    
    if server.auth_code is None:
        print("❌ Authorization timed out or failed!")
        return
    
    print("✅ Authorization successful!")
    
    # Exchange code for tokens
    print("\n🔄 Exchanging code for tokens...")
    
    auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    
    response = requests.post("https://accounts.spotify.com/api/token", {
        "grant_type": "authorization_code",
        "code": server.auth_code,
        "redirect_uri": redirect_uri
    }, headers={
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded"
    })
    
    if response.status_code == 200:
        tokens = response.json()
        
        print("\n🎉 Success! Here are your tokens:")
        print("=" * 50)
        print(f"SPOTIFY_CLIENT_ID={client_id}")
        print(f"SPOTIFY_CLIENT_SECRET={client_secret}")
        print(f"SPOTIFY_REFRESH_TOKEN={tokens['refresh_token']}")
        print("=" * 50)
        print("\n📝 Add these environment variables to your Vercel dashboard!")
        print("🔗 https://vercel.com/dashboard")
        
    else:
        print(f"❌ Token exchange failed: {response.text}")

if __name__ == "__main__":
    try:
        get_spotify_tokens()
    except KeyboardInterrupt:
        print("\n\n❌ Process interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
    
    input("\nPress Enter to exit...")
