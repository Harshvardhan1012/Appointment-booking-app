'use client'
import React from 'react'
import { handlelogout } from '@/lib/action/profile.action'
import { usePathname, useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button'

export default function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false)
  const noNavbarPaths = ['/login', '/'];
  const router = useRouter()
  const pathnames = usePathname()

  const handlelogoutfunction = async () => {
    try {
      
      console.log(new Date().getTime(), '++++');
      const res = await handlelogout();
      console.log(res);
      console.log(new Date().getTime(), '---');
      if (res) {
        router.push("/login");
        setIsOpen(false)
        return;
      }
    }
    catch (err) {
      setIsOpen(false)
    
      console.log(err);
    }
  }

  if (noNavbarPaths.includes(pathnames)) {
    return null; // Do not render navbar on login and signup pages
  }

  return (
    <form className='flex justify-between items-center bg-dark-400 text-white p-4 fixed top-0 left-0 z-10 w-full'>
      <div className="font-bold text-lg">App</div>
      <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" onClick={()=>setIsOpen(true)}>Show Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent   className='bg-dark-400 text-white w-[90%] sm:w-[70%] md:w-[50%] max-w-lg rounded-lg sm:m-5'>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure you want to logout</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={()=>setIsOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlelogoutfunction} className='rounded-md bg-red-900 border border-white'> 
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    

    </form>
  )
}
