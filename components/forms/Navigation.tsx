'use client'
import React from 'react'
import { handlelogout } from '@/lib/action/profile.action'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '../ui/button'


export  default function Navigation() {
 
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()

  const handlelogoutfunction = async () => {
    try {      
      const res = await handlelogout();
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

  

  return (
    <form className='flex justify-between items-center bg-dark-400 text-white p-4 fixed top-0 left-0 z-10 w-full'>
      <div className="font-bold text-lg">App</div>
      <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button onClick={()=>setIsOpen(true)} className='bg-red-900'>Logout</Button>
          </AlertDialogTrigger>
          <AlertDialogContent   className='bg-dark-400 border-dark-400 text-white w-[90%] sm:w-[70%] md:w-[50%] max-w-lg rounded-lg sm:m-5'>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout?
          </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={()=>setIsOpen(false)} className='border-dark-500 sm:w-20'>No</AlertDialogCancel>
              <AlertDialogAction onClick={handlelogoutfunction} className='rounded-md bg-red-900 border-dark-400 sm:w-20'> 
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    

    </form>
  )
}
