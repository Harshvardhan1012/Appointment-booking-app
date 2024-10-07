"use server"
import { AuthError } from "next-auth";
import { signIn } from "../auth";
import prisma from "@/lib/db";

export async function handleCredentialsSignin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    console.log("inside handleCredentialsSignin-----");
    const signin = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    const userfind=await prisma.user.findUnique({
      where:{
        email:email,
        password:password
      }
    });
    if (signin) {
      console.log("signin success");
      return {
        status: 200,
        user:userfind?.id,
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

