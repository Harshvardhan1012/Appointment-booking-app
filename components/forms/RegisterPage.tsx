'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { formSchema } from './../../lib/validation';
import { Form } from '@/components/ui/form';

import 'react-phone-number-input/style.css';
import CustomFormField, { FormFieldType } from './../ui/CustomForm';
import { useRouter } from 'next/navigation';
import { SubmitButton } from '@/components/ui/SubmitButton';
import Link from 'next/link';

export default function RegisterPage() {
  const [err, seterr] = useState(false);
  const [success, setsuccess] = useState(false);
  const [errmessage, seterrmessage] = useState('');
  const [loading, setloading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      email: '',
      phone: '',
    },
  });

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setloading(true);

    try {
      const user = {
        email: values.email,
        password: values.password,
        phone: values.phone,
      };

      const signin = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await signin.json();

      if (signin?.ok) {
        console.log('signin success', data);
        setsuccess(true);
        router.push(`/login`);
        return;
      } else {
        seterr(true);
        seterrmessage(data.message);
        setTimeout(() => {
          seterr(false);
          seterrmessage('');
        }, 3000);
      }
      setloading(false);
    } catch (error) {
      setloading(false);
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="w-[500px] justify-center items-center px-9 sm:px-6 md:px-8 lg:px-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 w-full"
          >
            <section className="mb-12 space-y-4 w-full">
              <h1 className="header text-white">Hi there 👋</h1>
              <p className="text-dark-700">Register as a Patient</p>
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
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter password"
              iconSrc="/assets/icons/password.svg"
              iconAlt="pass"
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phone"
              label="Phone number"
              placeholder="(555) 123-4567"
            />
            <SubmitButton
              label="Get Started"
              loading={loading}
              buttonColor="green"
            />
            {err && (
              <p className="text-red-700 text-sm flex justify-center">
                {errmessage}
              </p>
            )}
            {success && (
              <p className="text-green-700 text-sm flex justify-center">
                Account created redirecting to login page
              </p>
            )}
            <span className="text-white flex items-center justify-center">
              Already have an account?&nbsp;
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-300 underline ml-1"
              >
                Login
              </Link>
            </span>
          </form>
        </Form>
      </div>
    </div>
  );
}
