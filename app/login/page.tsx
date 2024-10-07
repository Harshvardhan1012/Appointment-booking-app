import LoginPage from '@/components/forms/LoginPage'
import { auth } from '../auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/profile/" + session?.user?.id);
  }
  return (
    <LoginPage />
  )
}
