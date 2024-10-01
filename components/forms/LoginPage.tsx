"use client";
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginformschema } from "../../lib/validation";
import { Form } from "@/components/ui/form";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../ui/CustomForm";
import email from './../../public/assets/icons/email.svg';
import { useRouter } from 'next/navigation';
import { handleCredentialsSignin } from '@/app/actions/formsubmit';
import { SubmitButton } from '../SubmitButton';


export default function LoginPage() {
  const router = useRouter();

  const [errmessage, seterrmessage] = useState("");
  const [loading, setloading] = useState(false);

  const form = useForm<z.infer<typeof loginformschema>>({
    resolver: zodResolver(loginformschema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginformschema>) => {
    try {
      setloading(true)
      const result = await handleCredentialsSignin(values);
      console.log(result);
      if (result?.message === "success") {
        console.log(result,"00000000000-1-1-");
        const userId=result.user;
        router.push('/profile/' + userId);
        return;
      };
      setloading(false);
      seterrmessage(result?.message || "unexpected error");
      setTimeout(() => {
        seterrmessage("");
      }, 3000);

    } catch (error) {
      setloading(false);
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };

  console.log("login page loadded -=-=-=++");

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="w-[500px] justify-center items-center  px-9 sm:px-6 md:px-8 lg:px-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 w-full"
          >
            <section className="mb-12 space-y-4 w-full">
              <h1 className="header">Hi there 👋</h1>
              <p className="text-dark-700">Get started with appointments.</p>
            </section>

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="@example.com"
              iconSrc={email}
              iconAlt="email"
            />

            <CustomFormField
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter password"
              iconSrc="/assets/icons/password.svg"
            // iconAlt="pass"
            />
            <SubmitButton loading={loading} label="Login" />
            {errmessage && <p className='text-red-500'>{errmessage}</p>}

          </form>
        </Form>
      </div>
    </div>
  )
}
