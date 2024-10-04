import { scheduleFormSchema } from "@/lib/validation";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function handleCredentialsSignin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    console.log("inside handleCredentialsSignin-----");

    const signin = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    console.log(signin,"singinifdsfdfdsf") ;
   
    const data=await signin.json();
    if (signin) {
      console.log("signin success");
      return {
        status: 200,
        user:data?.user?.id,
        message: "success",
      };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            status: 401,
            message: "invalid email or password",
          };
        default:
          return {
            status: 500,
            message: "Something went wrong.",
          };
      }
    }
    return {
      status: 500,
    };
  }
}


// export const schedular = async(appointment:number) => {   
//   const schedule=await appointmentupdate(appointment,'Approved');
//   console.log(schedule);
// }

// export const cancelappointment = async(appointment:number) => {
//   const cancel=await appointmentupdate(appointment,"Rejected");
//   console.log(cancel);
// }

