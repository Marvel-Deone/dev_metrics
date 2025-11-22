'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Home() {
  const { status } = useSession()

  if (status === 'authenticated') {
    redirect('/dashboard')
  } else if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  return null;
}
