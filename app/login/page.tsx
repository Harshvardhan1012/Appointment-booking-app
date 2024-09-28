import LoginPage from "@/components/forms/LoginPage";
import { auth } from "@/app/auth";
import { redirect } from 'next/navigation'

export default async function page() {
  const session = await auth();
  console.log("LOGINPAGE")

  if (session) {
    redirect('/dashboard');
  }

  console.log("-=-=-=-=-==");

  return (
    <div>
      <LoginPage />
    </div>
  )
}
