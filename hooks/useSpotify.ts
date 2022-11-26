import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

import spotifyApi from '../config/spotify';

import SpotifyAPIErrors from 'types/SpotifyAPIErrors';

const useSpotify = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    if (session) {
      //Handle errors
      if (session.error) {
        const error = session.error;

        switch (error) {
          case SpotifyAPIErrors.RefreshJWTError:
            void signIn();
            break;
          default:
            break;
        }
      }
      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [status]);

  return {
    api: spotifyApi,
    isAuthenticated,
  };
};

export default useSpotify;
