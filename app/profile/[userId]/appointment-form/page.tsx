import { auth } from '@/app/auth';
import AppointmentFormPage from '@/components/forms/Appointment-form-page';
import { profileFind } from '@/lib/action/profile.action';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AppointmentPage({
  params,
}: {
  params: { userId: string };
}) {
  const userId = params.userId;

  const sesssion = await auth();

  const profile = await profileFind(userId);
  if (!profile) {
    redirect('/profile/' + sesssion?.user.id);
  }

  return <AppointmentFormPage userId={userId} />;
}
