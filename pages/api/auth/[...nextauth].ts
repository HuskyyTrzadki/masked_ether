import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { JWT } from 'next-auth/jwt';

import SpotifyAPIErrors from 'types/SpotifyAPIErrors';
import spotifyApi, { LOGIN_URL } from 'config/spotify';
import config from 'config/config';


async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Replace if new one came back elese fall back to old refresh token
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: SpotifyAPIErrors.RefreshJWTError,
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: config.spotifyClientId,
      clientSecret: config.spotifyClientSecret,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: config.jwtSecret,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }): Promise<JWT> {
      //initial sign in
      console.log(token, account, user);
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token!,
          refreshToken: account.refresh_token!,
          username: account.providerAccountId!,
          accessTokenExpires: account.expires_at! * 1000, // we are handling expiry times in Milliseconds hence * 1000
        };
      }

      //Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      session.error = token.error;
      return session;
    },
  },
});
