import LoginPage from '@/components/forms/LoginPage'
import React from 'react'
import { auth } from '../auth';
import { redirect } from 'next/navigation';

export default async function page() {
  const session = await auth();

  if (session) {
    redirect("/profile/" + session?.user?.id);
  }
  return (
    <LoginPage />
  )
}
