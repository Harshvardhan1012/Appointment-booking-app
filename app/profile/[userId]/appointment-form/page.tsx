import AppointmentFormPage from '@/components/forms/Appointment-form-page'
import React from 'react'

export default async function AppointmentPage({ params }: { params: { userId: number } }) {


  const userId = params.userId;
  // if (Number(session?.user?.id) != userid) {
  //   //page not found page
  //   redirect('/login');
  // }
  // const userId = session?.user?.id;


  return (
    <AppointmentFormPage userId={Number(userId)} />
  )
}
