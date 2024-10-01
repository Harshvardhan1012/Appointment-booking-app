import { redirect } from "next/navigation";
import { auth } from "./auth";
import RegisterPage from "@/components/forms/RegisterPage";


export default async function Home() {
  const session = await auth();
  console.log("first")
  if (session) {
    redirect("/profile/" + session?.user?.id);
  }

  return (
    <RegisterPage />
  )
}
