"use client";
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { doctorRegisterSchema} from './../../lib/validation'
import { Form } from "@/components/ui/form";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from './../ui/CustomForm'
import { useRouter } from 'next/navigation';
import { SubmitButton } from '../SubmitButton';


export default function DoctorRegisterPage() {
    // console.log('second');

    const [err, seterr] = useState(false);
    const [success, setsuccess] = useState(false);
    const [errmessage, seterrmessage] = useState("");
    const [loading, setloading] = useState(false);

    const form = useForm<z.infer<typeof doctorRegisterSchema>>({
        resolver: zodResolver(doctorRegisterSchema),
        defaultValues: {
            username: "",
            password: "",
            FullName: "",
            ProfilePhoto: [],
        },
    });

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof doctorRegisterSchema>) => {

        setloading(true);

        try {
            const user = {
                username: values.username,
                password: values.password,
                FullName: values.FullName,
                ProfilePhoto: values.ProfilePhoto,
            };
            console.log(user);

            console.log("signing in");

            const signin = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const data = await signin.json();

            console.log(data);
            if (signin?.ok) {
                console.log("signin success", data);
                setsuccess(true);
                router.push(`/login`);
                return
            }
            else {
                seterr(true);
                console.log(signin);
                seterrmessage(data.message);
                setTimeout(() => {
                    seterr(false);
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
                            <p className="text-dark-700">Get started with appointments.</p>
                        </section>

                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="FullName"
                            label="Full Name"
                            placeholder="Enter Full Name"
                            iconSrc="/assets/icons/user.svg"
                            iconAlt="user"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="username"
                            label="Enter Username"
                            placeholder="harsh@123"
                        />

                        <CustomFormField
                            fieldType={FormFieldType.PASSWORD}
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="Enter password"
                            iconSrc='/assets/icons/password.svg'
                            iconAlt="pass"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.SKELETON}
                            control={form.control}
                            name="ProfilePhoto"
                            label="Upload Profile Photo"

                        />

                        {success && <p className='text-green-700 text-sm flex justify-center'>Account created redirecting to login page</p>}
                        {err && <p className='text-red-700 text-sm flex justify-center'>{errmessage}</p>}
                        <SubmitButton label='Get Started' loading={loading} buttonColor='green' />
                    </form>
                </Form>
            </div>
        </div>

    )
}
