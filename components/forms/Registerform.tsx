"use client";
import { registerformschema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from '../ui/CustomForm';
import { SubmitButton } from '../SubmitButton';
import { Form } from "@/components/ui/form";
import email from './../../public/assets/icons/email.svg';
import user from './../../public/assets/icons/user.svg';



export default function Registerform() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerformschema>>({
    resolver: zodResolver(registerformschema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dob: new Date(),
      gender: "Male",
      Address: "",
      Occupation: "",
      InsuranceId:"",
      InsuranceProvider:"",
      Allergies:"",
      identificationDocument: [],
      CurrentMedications:"",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerformschema>) => {
    setIsLoading(true);

    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        dob: values.dob,
        gender: values.gender,
        Address: values.Address,
        Occupation: values.Occupation,
        InsuranceId: values.InsuranceId,
        InsuranceProvider: values.InsuranceProvider,
        Allergies: values.Allergies,
        identificationDocument: values.identificationDocument,
        CurrentMedications: values.CurrentMedications
      };
      
      console.log(user);

    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="w-[700px] h-screen justify-center items-center mt-[100px]">
        <section className="mb-12 space-y-4 w-full">
          <h1 className="header text-white">Welcome</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 w-full"
          >
            <h1 className='text-white text-2xl'>Personal Information</h1>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              label="Full name"
              placeholder="John Doe"
              iconSrc={user}
              iconAlt="user"
            />

            <div className='grid grid-cols-2 justify-center gap-3 m-0'>
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="johndoe@gmail.com"
                iconSrc={email}
                iconAlt="email"
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone number"
                placeholder="(555) 123-4567"
              />
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="dob"
                label="Date of Birth"
                placeholder="DD/MM/YYYY"
                // iconSrc="/assets/icons/calendar.svg"
                iconAlt="calendar"
              />

              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="gender"
                label="Gender"
                placeholder="johndoe@gmail."
                iconAlt="gender"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="Address"
                label="Address"
                placeholder="Address"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="Occupation"
                label="Occupation"
                placeholder="Business/Job/Student"
              />
            </div>
            <h1 className='text-white text-2xl mt-4'>Medical Information</h1>

            <div className='grid grid-cols-2 justify-center gap-3 m-0'>
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="InsuranceProvider"
                label="Insurance Provider"
                placeholder="ex: Aetna"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="InsuranceId"
                label="Insurance ID"
                placeholder="ex: ABC123"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="Allergies"
                label="Allergies (if any)"
                placeholder="ex: Maleria/penicillin"

              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="CurrentMedications"
                label="Current Medications"
                placeholder="ex:paraacetamol"
              />
              

            </div>

            <section className="mb-12 space-y-4 w-full">
              <h1 className="header">Identification</h1>
            </section>
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="identificationDocument"
              label="Scanned Copy of Identification Document"

            />
            <SubmitButton isLoading={isLoading}>Submit and Continue</SubmitButton>
          </form>
        </Form>
      </div>
    </div>
  );
}
