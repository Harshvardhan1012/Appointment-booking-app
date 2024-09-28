"use server";
import { AuthError } from "next-auth";
import { signIn } from "../auth";
import { redirect } from "next/navigation";

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
    if (signin) {
      console.log("signin success");
      return {
        status: 200,
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
