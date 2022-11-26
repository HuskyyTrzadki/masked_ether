import type { DefaultUser } from 'next-auth';

import SpotifyAPIErrors from './SpotifyAPIErrors';

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
      username: string;
    } & DefaultUser;
    accessToken: string;
    error?: SpotifyAPIErrors;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    username: string;
    accessTokenExpires: number;
    error?: SpotifyAPIErrors;
  }
}
