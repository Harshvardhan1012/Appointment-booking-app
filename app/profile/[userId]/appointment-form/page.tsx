import { auth } from '@/app/auth';
import AppointmentFormPage from '@/components/forms/Appointment-form-page'
import { profilefind } from '@/lib/action/profile.action';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function AppointmentPage({ params }: { params: { userId: string } }) {


  const userId = params.userId;
  // if (Number(session?.user?.id) != userid) {
  //   //page not found page
  //   redirect('/login');
  // }
  // const userId = session?.user?.id;


  const sesssion=await auth();

  const profile=await profilefind(sesssion?.user?.id!);
  if(!profile){
    redirect('/profile/'+sesssion?.user.id);
  }
  // console.log(sesssion,"sessio4832487347832487234n");

  return (
    <AppointmentFormPage userId={userId} />
  )
}
