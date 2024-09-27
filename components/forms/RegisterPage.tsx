"use client";
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from './../../lib/validation'
import { Form } from "@/components/ui/form";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from './../ui/CustomForm'
import { useRouter } from 'next/navigation';
import { Button } from './../../components/ui/button'


export default function RegisterPage() {


    const [err,seterr]=useState(false);

    useEffect(()=>{
        setTimeout(()=>{
            seterr(false);
        },3000);
    },[err])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      email: "",
      phone: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {



    try {
      const user = {
        email: values.email,
        password: values.password,
        phone: values.phone,
      };
      console.log(user);

      console.log("signing in");

      const signin = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      

    
      console.log("signing in+=-+=-=");

      if (signin?.ok) {

        console.log("Login successful:", signin);
        router.push('/dashboard');
        return

      }

      seterr(true);

    //   if(signin)

    }
    catch (error) {
      console.error("Login error:", error);
    }

  };

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
              iconSrc="/assets/icons/email.svg"
              iconAlt="user"
              />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter password"
            //   iconSrc=''
              iconAlt="pass"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone number"
              placeholder="(555) 123-4567"
              />
              {err && <p className='text-red-700 text-sm flex'>Email already registered</p>}
            <Button type='submit' className='bg-green-500'>Register</Button>
          </form>
        </Form>
      </div>
    </div>

)
}
