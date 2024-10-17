"use client";
import React from 'react'
import CustomFormField, { FormFieldType } from '../ui/CustomForm'
import { Form } from '../ui/form'
import { appointmentformschema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { SubmitButton } from '../SubmitButton';

export default function AppointmentFormPage({userId}:{userId:string}) {

    const router = useRouter();

    const [errMessage, setErrMessage] = React.useState("");
    const [loading, setIsLoading] = React.useState(false);


    const form = useForm<z.infer<typeof appointmentformschema>>({
        resolver: zodResolver(appointmentformschema),
        defaultValues: {
            physician: "",
            Date: new Date(),
            Reason: "",
        },
    });

    
    const onSubmit = async (values: z.infer<typeof appointmentformschema>) => {
        try {
            setIsLoading(true);
            const user = {
                physician: values.physician,
                Date: values.Date,
                Reason: values.Reason,
            }
            
            const res = await fetch("/api/auth/appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
                cache: "no-cache",
            });
            const data= await res.json();
            
            if(res?.ok){
                console.log("Appointment success");
              
                router.push('/profile/'+userId+'/appointment-form/success/'+data.appointment.id);
                return;
            }

            setErrMessage(data?.error?? "unexpected error");
            setTimeout(() => {
                setErrMessage("");
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
            
                    <SubmitButton loading={loading} label="Submit and Continue" className='bg-green-500' />
                        {errMessage && <p className='text-red-500 text-sm flex justify-center'>{errMessage}</p>}
                    </form>
                </Form>
            </div>
        </div>

    )
}
