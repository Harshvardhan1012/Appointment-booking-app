import { auth } from '@/app/auth';
import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';

export const getServerSideProps = (async () => {
  const session = await auth();
  console.log('-002003', session);

  return {
    props: {
      session,
      harsh: ' harsh',
    },
  };
}) satisfies GetServerSideProps<{ session: Session | null }>;
