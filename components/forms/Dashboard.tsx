"use client";
import { registerformschema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from '../ui/CustomForm';
import { SubmitButton } from '../SubmitButton';
import { Form } from "@/components/ui/form";
import email from './../../public/assets/icons/email.svg';
import user from './../../public/assets/icons/user.svg';
import { useRouter } from 'next/navigation';


export default function Dashboard({ userId }: { userId: number }) {


  const router = useRouter();
  useLayoutEffect(() => {
    router.refresh();
   
  }, [router]);

  const [loading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState("");
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
      InsuranceId: "",
      InsuranceProvider: "",
      Allergies: "",
      CurrentMedications: "",
    },
  });




  const onSubmit = async (values: z.infer<typeof registerformschema>) => {
    setIsLoading(true);

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
      CurrentMedications: values.CurrentMedications
    };


    const res = await fetch("/api/auth/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (res?.ok) {
      router.push("/profile/" + userId + "/appointment-form");
      return;
    }
    const data = await res.json();
    setErrMessage(data?.error ?? "unexpected error");

    setIsLoading(false);
  };

  return (


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

        <div className='grid grid-cols-1 justify-center gap-3 m-0 lg:grid-cols-2'>
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

        <div className='grid grid-cols-1 justify-center gap-3 m-0 lg:grid-cols-2'>
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
        {/* <h1 className='text-white text-2xl mt-4'>Verification Documents</h1>
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned Copy of Identification Document"

        /> */}
        <SubmitButton loading={loading} label='Submit and Continue' />
        {errMessage && <p className='text-red-500 text-sm flex justify-center'>{errMessage}</p>}
      </form>
    </Form>

  );
}


