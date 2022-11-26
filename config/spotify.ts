import SpotifyWebApi from 'spotify-web-api-node';

const spotifyAuthScopes = [
  'user-read-email',
  'streaming',
  'user-read-playback-state',
  'user-read-private',
  'user-library-read',
  'playlist-read-private',
].join(',');

const params = {
  scope: spotifyAuthScopes,
};

const queryString = new URLSearchParams(params);

export const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryString.toString()}`;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
});

export default spotifyApi;
