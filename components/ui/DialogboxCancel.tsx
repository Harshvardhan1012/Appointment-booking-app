"use client"
import { Button } from "@/components/ui/button"
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { Form } from "./form";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "./CustomForm";
import { cancellationformschema} from "@/lib/validation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitButton } from "../SubmitButton";
import clearCachesByServerAction from "@/app/superadmin/revalidate";





export function DialogboxCancel({ title, description, id ,setOpen }: { title: string, description: string, id: number,setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [loading, setloading] = React.useState(false);

    
    const form = useForm<z.infer<typeof cancellationformschema>>({
        resolver: zodResolver(cancellationformschema),
        defaultValues: {
           CancellationReason:""
        },
    });


    const onSubmit = async (values: z.infer<typeof cancellationformschema>) => {

        console.log(values, "values");
     

            try {
                setloading(true);
               const cancelled= await fetch('/api/auth/appointmentfind', {
                    method: 'PUT',
                    body: JSON.stringify({ appointmentId: id, status: 'Rejected' }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                await clearCachesByServerAction('/auperadmin');
                const data=await cancelled.json();
                console.log(data,'data');
                console.log("appointment canclled");
                setloading(false)
                setOpen(false);
            }
            catch (e) {
                setOpen(false);
                setloading(false);
                console.log(e);
            }
        
    }

    return (

        <DialogContent className="sm:max-w-[425px] text-white">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex-1 space-y-6 w-full"
                >
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="CancellationReason"
                        label="Reason for cancellation"
                        placeholder="can't make it"
                    />
                    <DialogFooter>
                       
                            <SubmitButton className="bg-red-700" label='Cancel Appointment' loading={loading} />  
                       
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>

    )
}