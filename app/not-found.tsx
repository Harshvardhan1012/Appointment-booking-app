import React from 'react'
import { auth } from './auth'
import  Link  from 'next/link';
import { Button } from '@/components/ui/button';

export default async function NotFound() {
    const session=await auth();
   

  return (
    <div className='text-white flex justify-center items-center h-screen flex-col gap-4'>
        <h1 className="text-4xl">404 - Page not found</h1>
        {
            session?
            <div>
               <Button className='text-lg'> <Link href={`/profile/${session?.user?.id}`} >Return to profile</Link></Button>
            </div>
            :
            <div>
                <Button className='text-lg '> <Link href={`/login`} >Return to home page</Link></Button>
            </div>
        }

    </div>
  )
}
