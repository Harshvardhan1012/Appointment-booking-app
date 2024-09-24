"use client";
import React from 'react'
import CustomFormField, { FormFieldType } from '../ui/CustomForm'
import { Form } from '../ui/form'
import { appointmentformschema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { SubmitButton } from '../SubmitButton';
import { Button } from '../ui/button';

export default function AppointmentFormPage() {


    const form = useForm<z.infer<typeof appointmentformschema>>({
        resolver: zodResolver(appointmentformschema),
        defaultValues: {
            Doctor: "",
            date: new Date(),
            Reason: "",
        },
    });
    const onSubmit = async (values: z.infer<typeof appointmentformschema>) => {


        try {
            const user = {
                Doctor: values.Doctor,
                date: values.date,
                Reason: values.Reason,
            }
            console.log(user);

        } catch (error) {
            console.log(error);
        }


    };

    return (

        <div className="flex justify-center items-center ">
            <div className="w-[700px] h-screen justify-center items-center mt-[100px]">
                <section className="mb-12 space-y-4 w-full">
                    <h1 className="header text-white">Hey there 👋</h1>
                    <p className="text-dark-700">Request a new appointment in 10 seconds</p>
                </section>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex-1 space-y-6 w-full"
                    >
                        <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="Doctor"
                            label="Primary care physician"
                            placeholder="Dr.John Doe"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="Reason"
                            label="Insurance Provider"
                            placeholder="ex: Aetna"
                           
                        />
                        <CustomFormField
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="date"
                            label="Expected Date of Appointment"
                            placeholder="DD/MM/YYYY"
                            iconAlt="calendar"
                        />
                    <Button type='submit' className='shad-primary-btn w-full'>Submit and Continue</Button>
                    </form>
                </Form>
            </div>
        </div>



    )
}
