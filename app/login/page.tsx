import LoginPage from "@/components/forms/LoginPage";
import { auth } from "@/app/auth";
import { redirect } from 'next/navigation'

export default async function page() {
  const session = await auth();
  console.log("home sessionpage ofl login")
  
  if(session)  {
    redirect('/dashboard');
  }

  console.log("-=-=-=-=-==");
  
  return (
    <LoginPage />
   
  )
}
