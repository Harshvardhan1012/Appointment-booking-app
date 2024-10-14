// "use client"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import React from 'react'
import { useForm } from "react-hook-form";
import { Form } from "./form";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "./CustomForm";
import { scheduleFormSchema } from "@/lib/validation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitButton } from "../SubmitButton";
import clearCachesByServerAction from "./../../lib/action/clearcachesbyaction";





export function DialogboxSchedule({ title, description, id, physician, setOpen }: { title: string, description: string, id: number, physician: string, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [loading, setloading] = React.useState(false);
    console.log(id, "id");
   const form = useForm<z.infer<typeof scheduleFormSchema>>({
        resolver: zodResolver(scheduleFormSchema),
        defaultValues: {
            physician: physician,
            Remarks: "",
            ExpectedDate: new Date(),
        },
    });


    const onSubmit = async (values: z.infer<typeof scheduleFormSchema>) => {

        console.log(values, "values");


        try {
            setloading(true);
            await fetch('/api/auth/appointmentfind', {
                method: 'PUT',
                body: JSON.stringify({ appointmentId: id, status: 'Approved' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            await clearCachesByServerAction(`/admin/${id}`);

            console.log("appointment approved");
            setloading(false);
            setOpen(false);
        }
        catch (e) {
            setloading(false);
            setOpen(false);
            console.log(e);
        }

    }

    return (

        <DialogContent className="sm:max-w-[425px] text-white bg-dark-400 border-dark-400">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form
                    tabIndex={0}
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex-1 space-y-6 w-full"
                >

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="physician"
                        label="Doctor"
                        readonly
                    />
                    <CustomFormField
                        fieldType={FormFieldType.DATE_PICKER}
                        control={form.control}
                        name="ExpectedDate"
                        label="Expected Date of Appointment"
                        placeholder="DD/MM/YYYY"
                        iconAlt="calendar"
                    />
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="Remarks"
                        label="Remarks"
                        placeholder="be at time"

                    />



                    <DialogFooter>

                        <SubmitButton className=" bg-green-500" label='Schedule' loading={loading} />

                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>

    )
}