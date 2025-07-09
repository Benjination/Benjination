const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} = process.env;

const client_id = SPOTIFY_CLIENT_ID;
const client_secret = SPOTIFY_CLIENT_SECRET;
const refresh_token = SPOTIFY_REFRESH_TOKEN;

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};

const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const generateSVG = (isPlaying, song) => {
  if (!isPlaying) {
    return `
      <svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
        <style>
          .container { fill: #1a1b27; }
          .text { fill: #c9aa71; font: 600 16px 'Segoe UI', Ubuntu, Sans-Serif; }
          .subtext { fill: #9ca3af; font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; }
          .spotify { fill: #1ED760; }
        </style>
        <rect class="container" width="400" height="120" rx="15"/>
        <rect class="spotify" x="20" y="20" width="4" height="80" rx="2"/>
        <text class="text" x="40" y="45">Not Playing</text>
        <text class="subtext" x="40" y="65">Spotify</text>
        <text class="subtext" x="40" y="85">🎵 Currently offline</text>
      </svg>
    `;
  }

  const { item } = song;
  const artist = item.artists.map((_artist) => _artist.name).join(', ');
  const track = item.name;
  const albumArt = item.album.images[2]?.url || '';
  
  // Truncate long text
  const maxLength = 25;
  const truncatedTrack = track.length > maxLength ? track.substring(0, maxLength) + '...' : track;
  const truncatedArtist = artist.length > maxLength ? artist.substring(0, maxLength) + '...' : artist;

  return `
    <svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
      <style>
        .container { fill: #1a1b27; }
        .text { fill: #c9aa71; font: 600 14px 'Segoe UI', Ubuntu, Sans-Serif; }
        .subtext { fill: #9ca3af; font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif; }
        .spotify { fill: #1ED760; }
        .playing { animation: pulse 2s infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      </style>
      <rect class="container" width="400" height="120" rx="15"/>
      <rect class="spotify playing" x="20" y="20" width="4" height="80" rx="2"/>
      ${albumArt ? `<image href="${albumArt}" x="35" y="20" width="80" height="80" rx="8"/>` : ''}
      <text class="text" x="${albumArt ? '130' : '40'}" y="45">${truncatedTrack}</text>
      <text class="subtext" x="${albumArt ? '130' : '40'}" y="65">by ${truncatedArtist}</text>
      <text class="subtext" x="${albumArt ? '130' : '40'}" y="85">🎵 Now playing on Spotify</text>
    </svg>
  `;
};

export default async function handler(req, res) {
  try {
    const response = await getNowPlaying();

    if (response.status === 204 || response.status > 400) {
      return res.status(200).setHeader('Content-Type', 'image/svg+xml').send(generateSVG(false));
    }

    const song = await response.json();
    const isPlaying = song.is_playing;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=60');
    
    return res.status(200).send(generateSVG(isPlaying, song));
  } catch (error) {
    console.error('Error:', error);
    return res.status(200).setHeader('Content-Type', 'image/svg+xml').send(generateSVG(false));
  }
}
