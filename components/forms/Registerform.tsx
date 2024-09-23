import { registerformschema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import {  useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomFormField, { FormFieldType } from '../ui/CustomForm';
import { SubmitButton } from '../SubmitButton';
import { Form } from '../ui/form';

export default function Registerform() {
    const [isLoading, setIsLoading] = useState(false);
  
    const form = useForm<z.infer<typeof registerformschema>>({
      resolver: zodResolver(registerformschema),
      defaultValues: {
        name: "",
        email: "",
        phone: "",
        dob:"",
        gender:"Male",
        Address:"",
        Occupation:"",
      },
    });
  
    const onSubmit = async (values: z.infer<typeof registerformschema>) => {
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
    );
}
