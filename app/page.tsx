'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Home = () => {
  const { status } = useSession()

  if (status === 'authenticated') {
    redirect('/dashboard')
  } else if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  return null;
}

export default Home;