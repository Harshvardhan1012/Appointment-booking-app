import AppointmentFormPage from '@/components/forms/Appointment-form-page'
import { redirect } from 'next/navigation';
import React from 'react'
import { auth } from '../../../auth';
import { profilefind } from '@/app/api/auth/profilefind/route';

export default async function AppointmentPage({ params }: { params: { userId: number } }) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const userid = params.userId;
  console.log("params useridf", userid);
  if (Number(session?.user?.id) != userid) {
    //page not found page
    redirect('/login');
  }
  const userId = session?.user?.id;
  console.log("userId in appointment form", userId);

  const isprofile = await profilefind(Number(userId));


  if (!isprofile) {
    redirect('/profile/' + userId);
  }



  return (
    <AppointmentFormPage userId={Number(userId)} />
  )
}
