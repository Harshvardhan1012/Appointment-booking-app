'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loginformschema } from '../../lib/validation';
import { Form } from '@/components/ui/form';
import 'react-phone-number-input/style.css';
import CustomFormField, { FormFieldType } from '../ui/CustomForm';
import email from './../../public/assets/icons/email.svg';
import { SubmitButton } from '../SubmitButton';
import Link from 'next/link';
import { loginwithGoogle } from '@/lib/action/profile.action';
import { Button } from '../ui/button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function LoginPage() {
  const [errmessage, seterrmessage] = useState('');
  const [success, setsuccess] = useState('');
  const [loading, setloading] = useState(false);

  const form = useForm<z.infer<typeof loginformschema>>({
    resolver: zodResolver(loginformschema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginformschema>) => {
    try {
      setloading(true);
      await signIn('nodemailer', {
        redirect: false,
        email: values.email,
      });

      setloading(false);
      setsuccess('Verification link has been sent to your email');
      setTimeout(() => {
        setsuccess('');
      }, 5000);
    } catch (error) {
      setloading(false);
      seterrmessage('something went wrong');
      setTimeout(() => {
        seterrmessage('');
      }, 3000);
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="w-[500px] justify-center items-center  px-9 sm:px-6 md:px-8 lg:px-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 w-full"
          >
            <section className="mb-12 space-y-4 w-full">
              <h1 className="header text-white">Hi there 👋</h1>
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

            <SubmitButton loading={loading} label="Login" buttonColor="green" />
            {errmessage && <p className="text-red-500">{errmessage}</p>}
            {success && (
              <p className="text-green-500 text-center ">{success}</p>
            )}
          </form>
        </Form>
        <form action={loginwithGoogle} className="flex justify-center mt-5">
          <Button
            type="submit"
            aria-label="Sign in with Google"
            className="flex items-center bg-inherit border border-button-border-light rounded-full p-0.5 pr-4 w-full"
          >
            <div className="flex items-center justify-center bg-inherit w-9 h-9 rounded-full">
              <Image
                src="/assets/icons/google.svg"
                alt="google"
                width={29}
                height={29}
              />
            </div>
            <span className="text-sm text-google-text-gray tracking-wider">
              Sign in with Google
            </span>
          </Button>
        </form>
        <span className="text-white flex flex-col items-center justify-center mt-4">
          <Link href="/admin/register" className="">
            Register as Admin
          </Link>
        </span>
      </div>
    </div>
  );
}
