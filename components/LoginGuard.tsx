import {ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

type LoginGuardProps = {
  children: ReactNode
}

const LoginGuard = ({children}: LoginGuardProps) => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      if (router.pathname !== '/login') {
        void router.push('/login');
      }
    }
  },[status]);

  return (<>{children}</>);
}

export default LoginGuard;