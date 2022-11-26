import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import LoginGuard from 'components/LoginGuard';

export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
    <SessionProvider session={session}>
      <LoginGuard>
        <Component {...pageProps} />
      </LoginGuard>
    </SessionProvider>
  )
}
