"use server"
import LoginPage from '@/components/forms/LoginPage'


export default async function Page() {
  // const session = await auth();

  // if (session) {
  //   redirect("/profile/" + session?.user?.id);
  // }
  return (
    <LoginPage />

  )
}
