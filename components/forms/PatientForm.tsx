"use client";
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./../../lib/validation";
import { Form } from "@/components/ui/form";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "./../ui/CustomForm";
import { SubmitButton } from '../SubmitButton';


export default function PatientForm() {

   
    const [isLoading, setIsLoading] = useState(false);
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
      },
    });
  
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      setIsLoading(true);
  
      try {
        const user = {
          name: values.name,
          email: values.email,
          phone: values.phone,
        };
        console.log(user);
  
        // const newUser = await createUser(user);
  
        // if (newUser) {
        //   router.push(`/patients/${newUser.$id}/register`);
        // }
      } catch (error) {
        console.log(error);
      }
  
      setIsLoading(false);
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
                name="name"
                label="Full name"
                placeholder="John Doe"
                iconSrc="/assets/icons/user.svg"
                iconAlt="user"
              />
  
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="johndoe@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />
  
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone number"
                placeholder="(555) 123-4567"
              />
              <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
          </Form>
        </div>
      </div>
    )
}
