import { auth } from '@/app/auth'
import UpdateProfile from '@/components/forms/UpdateProfile'
import React from 'react'

export default async function page() {
    const session=await auth();
  return (
    <UpdateProfile user={session?.user!}/>
  )
}
