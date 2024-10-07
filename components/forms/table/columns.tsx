/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { Status } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { Dialog, DialogTrigger } from "../../ui/dialog"
import React, { useState } from "react"
import { Button } from "../../ui/button"
import { DialogboxSchedule } from "../../ui/DialogboxSchedule"
import { DialogboxCancel } from "../../ui/DialogboxCancel"
import check from '@/public/assets/icons/check.svg';
import pending from '@/public/assets/icons/pending.svg';
import cancelled from '@/public/assets/icons/cancelled.svg';

import Image from "next/image"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Appointmenttable = {
    id: number;
    physician: string;
    Reason: string;
    Date: Date;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    AppointmentStatus: Status;
}

export const columns: ColumnDef<Appointmenttable>[] = [
    {
        accessorKey: "id",
        sortingFn: 'alphanumericCaseSensitive',
        header: () => {

            return (
                <span className="flex justify-center items-center">
                    ID
                </span>
            )
        },

        cell: ({ row, table }) => {
            const rowid = (table.getSortedRowModel()?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1;
            return (
                <span className="flex justify-center items-center">
                    {rowid}
                </span>
            )
        }
    },
    {
        accessorKey: "AppointmentStatus",
        header: () => {
            return (
                <span className="flex justify-center items-center">
                    Status
                </span>
            )
        },
        cell: ({ row }) => {
            const status = row.original.AppointmentStatus;
            return (
                <span className="flex justify-center items-center">
                    <span
                        className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full w-[105px] justify-center
                                ${status === 'Approved' ? 'bg-green-300 text-green-800 dark:bg-green-900 dark:text-green-300'
                                : status === 'Rejected' ? 'bg-red-300 text-red-800 dark:bg-red- dark:text-red-300'
                                    : 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300'}`}
                    >
                        {status === 'Approved' && (
                            <Image src={check} alt="check" className="w-4 h-4 me-1" />
                        )}
                        {status === 'Pending' && (
                            <Image src={pending} alt="pending" className="w-4 h-4 me-1" />
                        )}
                        {status === 'Rejected' && (
                            <Image src={cancelled} alt="cancelled" className="w-4 h-4 me-1" />
                        )}
                        {status === 'Approved' ? 'Scheduled' : status === 'Rejected' ? 'Cancelled' : 'Pending'}
                    </span>
                </span>


            )
        }
    },
    {
        accessorKey: "Date",
        header: () => {
            return (
                <span className="flex justify-center items-center">
                    Date
                </span>
            )
        },
        cell: ({ row }) => {
            const date = row.original.Date;
            return (
                <span className="flex justify-center items-center">
                    {date.getUTCDate()}-{date.toLocaleString('default', { month: 'long' })}-{date.getUTCFullYear()}
                </span>
            )
        }
    },
    {
        accessorKey: "physician",
        header: () => {
            return (
                <span className="flex justify-center items-center">
                    Physician
                </span>
            )
        },
        cell: ({ row }) => {
            const physician = row.original.physician;
            return (
                <span className="flex justify-center items-center">
                    {physician}
                </span>
            )
        }
    },
    {
        id: "actions",
        header: () => {
            return (
                <span className="flex justify-center items-center">
                    Actions
                </span>
            )
        },
        cell: ({ row }) => {
            const e = row.original
            const [open1, setOpen1] = useState(false);
            const [open2, setOpen2] = useState(false);
           

            return (
                <div className="flex items-center gap-2 justify-center">
                    {
                        e.AppointmentStatus === 'Rejected'?(
                            <Dialog open={open1} onOpenChange={setOpen1}>
                                <DialogTrigger asChild>
                                    <Button className="text-green-500" onClick={() => setOpen1(true)}>Schedule</Button>
                                </DialogTrigger>
                                <DialogboxSchedule key={e.id} title='Schedule' description='Select date and add remarks for scheduling an appointment' id={e.id} physician={e.physician} setOpen={setOpen1} />
                            </Dialog>)
                    :e.AppointmentStatus === 'Approved'?
                   ( 
                    <Dialog open={open2} onOpenChange={setOpen2}>
                        <DialogTrigger asChild>
                            <Button className="text-red-400" onClick={() => setOpen2(true)}>Cancel</Button>
                        </DialogTrigger>
                        <DialogboxCancel key={e.id} setOpen={setOpen2} title='Cancel Appointment' description='Are you sure you want to cancel the appointment' id={e.id} />
                    </Dialog>):
                    (
                        <>
                        <Dialog open={open1} onOpenChange={setOpen1}>
                            <DialogTrigger asChild>
                                <Button className="text-green-500" onClick={() => setOpen1(true)}>Schedule</Button>
                            </DialogTrigger>
                            <DialogboxSchedule key={e.id} title='enter' description='Select date and add remarks for scheduling an appointment' id={e.id} physician={e.physician} setOpen={setOpen1} />
                        </Dialog>
                         <Dialog open={open2} onOpenChange={setOpen2}>
                         <DialogTrigger asChild>
                             <Button className="text-red-400" onClick={() => setOpen2(true)}>Cancel</Button>
                         </DialogTrigger>
                         <DialogboxCancel key={e.id} setOpen={setOpen2} title='enter' description='Select date and add remarks for scheduling an appointment' id={e.id} />
                     </Dialog>
                     </>)
                    
                    }
                </div>)
            
        }
    },
]
