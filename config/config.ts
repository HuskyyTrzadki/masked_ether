const getEnvVar = (envVarName: string) => {
  const lookupResult = process.env[envVarName];
  if (lookupResult === undefined) {
    throw new Error(`Could not load environment variable: ${envVarName}`);
  }
  return lookupResult;
};

export default {
  spotifyClientId: getEnvVar('SPOTIFY_CLIENT_ID'),
  spotifyClientSecret: getEnvVar('SPOTIFY_CLIENT_SECRET'),
  authUrl: getEnvVar('NEXTAUTH_URL'),
  jwtSecret: getEnvVar('JWT_SECRET'),
};
