import { useEffect } from 'react';
import { getProviders, signIn, ClientSafeProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
};

type LoginPageProps = {
  providers: ReturnType<typeof getProviders>;
};

const LoginPage = ({ providers }: LoginPageProps) => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      void signIn('spotify');
    } else if (status === 'authenticated') {
      void router.push('/');
    }
  }, [status]);

  return <div></div>;
};

export default LoginPage;
