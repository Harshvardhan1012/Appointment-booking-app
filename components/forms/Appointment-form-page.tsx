'use client';
import React from 'react';
import CustomFormField, { FormFieldType } from '../ui/CustomForm';
import { Form } from '../ui/form';
import { appointmentformschema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { requestAppointment } from '@/lib/action/appointment.action';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function AppointmentFormPage({ userId }: { userId: string }) {
  const router = useRouter();
  const [errMessage, setErrMessage] = React.useState('');
  const [loading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof appointmentformschema>>({
    resolver: zodResolver(appointmentformschema),
    defaultValues: {
      physician: '',
      Date: new Date(),
      Reason: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof appointmentformschema>) => {
    try {
      setIsLoading(true);
      const user = {
        physician: values.physician,
        Date: values.Date,
        Reason: values.Reason,
        userId,
      };

      const res = await requestAppointment(user);

      if (res.message === 'success') {
        console.log('Appointment success');

        router.push(
          '/profile/' +
          userId +
          '/appointment-form/success/' +
          res.appointment?.id
        );
        return null;
      }

      setErrMessage(res.error ?? 'unexpected error');
      setTimeout(() => {
        setErrMessage('');
      }, 3000);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center mt-[100px]">
      <div className="w-[700px] justify-center items-center px-8 sm:px-5 md:px-7 lg:px-0">
        <section className="mb-12 space-y-4 w-full">
          <h1 className="header text-white">Hey there 👋</h1>
          <p className="text-dark-700">
            Request a new appointment in 10 seconds
          </p>
        </section>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 w-full"
          >
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="physician"
              label="Primary care physician"
              placeholder="Select Physician"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="Reason"
              label="Reason for appointment"
              placeholder="ex: Aetna"
            />
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="Date"
              label="Expected Date of Appointment"
              placeholder="DD/MM/YYYY"
              iconAlt="calendar"
            />

            <SubmitButton
              loading={loading}
              label="Submit and Continue"
              buttonColor="green"
            />
            {errMessage && (
              <p className="text-red-500 text-sm flex justify-center">
                {errMessage}
              </p>
            )}
            <div className="flex items-center justify-center my-4">
              <div className="flex-grow h-px bg-gray-500"></div>
              <span className="text-gray-500 mx-2">OR</span>
              <div className="flex-grow h-px bg-gray-500"></div>
            </div>

            <Link href={`/profile/${userId}/manage`}>
              <Button className="bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-1 w-full mt-3">
                Manage Appointments
              </Button>
            </Link>
          </form>
        </Form>
      </div>
    </div>
  );
}
