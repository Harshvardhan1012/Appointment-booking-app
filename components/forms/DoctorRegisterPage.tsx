"use client";
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { doctorRegisterSchema } from './../../lib/validation'
import { Form } from "@/components/ui/form";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from './../ui/CustomForm'
import { useRouter } from 'next/navigation';
import { SubmitButton } from '../SubmitButton';
import { adminRegister } from '@/lib/action/admin.action';
import Link from 'next/link';


export default function DoctorRegisterPage() {
    // console.log('second');

    const [success, setsuccess] = useState(false);
    const [errmessage, seterrmessage] = useState("");
    const [loading, setloading] = useState(false);

    const form = useForm<z.infer<typeof doctorRegisterSchema>>({
        resolver: zodResolver(doctorRegisterSchema),
        defaultValues: {
            email: "",
            
            name: "",
        },
    });

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof doctorRegisterSchema>) => {

        setloading(true);

        try {
            const user = {
                email: values.email,
               
                name: values.name,
                // ProfilePhoto: values.ProfilePhoto,
            };
            const register = await adminRegister(user);


            if (register.status === 200) {
                console.log("signin success", register);
                setsuccess(true);
                router.push(`/login`);
                return
            }
            else {
                seterrmessage(register.message);
                setTimeout(() => {
                    seterrmessage("");
                }, 3000);
            }
            setloading(false);

        }
        catch (error) {
            setloading(false);
            console.error("Login error:", error);
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
                            <h1 className="header">Hi there 👋</h1>
                            <p className="text-dark-700">Register as a Doctor.</p>
                        </section>

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="name"
                            label="Full Name"
                            placeholder="Harshvardhan Singh"
                            iconSrc="/assets/icons/user.svg"
                            iconAlt="user"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="email"
                            label="Email Address"
                            placeholder="harsh@gmail.com"
                            iconSrc='/assets/icons/email.svg'
                        />

                        <SubmitButton label='Get Started' loading={loading} buttonColor='green' />
                        {success && <p className='text-green-700 text-sm flex justify-center'>Account created redirecting to login page</p>}
                        {errmessage && <p className='text-red-700 text-sm flex justify-center'>{errmessage}</p>}
                        <span className='text-white flex items-center justify-center'>
                            Already have an account?&nbsp;
                            <Link href="/login" className='text-blue-500 hover:text-blue-300 underline ml-1'>
                                Login
                            </Link>
                        </span>
                    </form>
                </Form>
            </div>
        </div>

    )
}
