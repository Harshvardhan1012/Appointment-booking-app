import Registerform from '@/components/forms/Registerform'
import React from 'react'
import { auth } from '../auth';

export default async function page() {
  const session = await auth();
  console.log(session, "session--");


  return (
    <Registerform/>
  )
}
