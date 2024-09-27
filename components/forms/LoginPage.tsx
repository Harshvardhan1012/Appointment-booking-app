"use client";
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {  loginformschema } from "../../lib/validation";
import { Form } from "@/components/ui/form";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../ui/CustomForm";
import email from './../../public/assets/icons/email.svg';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';



export default  function LoginPage() {
  const [err, setErr] = useState(false);
  const [errmessage, seterrmessage] = useState("");


  const form = useForm<z.infer<typeof loginformschema>>({
    resolver: zodResolver(loginformschema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
const router=useRouter();

  const onSubmit = async (values: z.infer<typeof loginformschema>) => {
    console.log("submittedd===")
    // setIsLoading(true);

    try {
      const user = {
        password: values.password,
        email: values.email,
      };
      console.log(user);

      console.log("signing in");

      const signin = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      // const signin = await signIn("credentials", {  user,redirect:false} );


      const data=await signin.json();

      console.log(data);
  

      if (data.code === 500) {
        // If there is an error, show the error message
        setErr(true);
        seterrmessage(data.error);
      }
      if (signin?.ok) {

        console.log("Login successful:", signin);

        router.push('/dashboard');


      }
    }
    catch (error) {
      console.error("Login error:", error);
    }

  };

  console.log("login page loadded -=-=-=++");

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="w-[500px] justify-center items-center">
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
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter password"
            // iconSrc={email}
            // iconAlt="pass"
            />
            {err && <p className='text-red-500'>{errmessage}</p>}
            <Button type='submit' className='bg-green-500'>Get Started</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
