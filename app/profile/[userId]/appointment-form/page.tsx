import { auth } from '@/app/auth';
import AppointmentFormPage from '@/components/forms/Appointment-form-page'
import React from 'react'

export default async function AppointmentPage({ params }: { params: { userId: string } }) {


  const userId = params.userId;
  // if (Number(session?.user?.id) != userid) {
  //   //page not found page
  //   redirect('/login');
  // }
  // const userId = session?.user?.id;
  const sesssion=await auth();
  console.log(sesssion,"sessio4832487347832487234n");

  return (
    <AppointmentFormPage userId={userId} />
  )
}
