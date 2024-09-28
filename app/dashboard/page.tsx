import Registerform from '@/components/forms/Registerform'
import React from 'react'
import { auth } from '../auth';
import { redirect } from 'next/navigation';

export default async function page() {
  const session = await auth();
  console.log("DASHBOARDPAGE")

  if(!session)  {
    redirect('/login');
  }

  return (
    <Registerform/>
  )
}
