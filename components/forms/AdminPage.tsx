"use client"
import React, { useEffect } from 'react'
import { TableBody, TableCell, TableRow } from '../ui/table'
import { DialogboxSchedule } from '../ui/DialogboxSchedule'
import { Button } from '../ui/button'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { DialogboxCancel } from '../ui/DialogboxCancel'
import { useRouter } from 'next/navigation'
import { Appointment } from '@prisma/client'

export default function AdminPage({ appointment }: { appointment:Appointment[] }) {
    const [open1, setOpen1] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

    const router = useRouter();
    useEffect(() => {
        router.refresh();
    }, [router]);

    const scheduleopener = (e:string) => {
        // router.refresh();
        router.push(`/admin?name=${e}`);
        setOpen1(true);
    }
    return (
        <>
            <TableBody>
                {appointment.map((e: Appointment) => (
                    <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.userId}</TableCell>
                        <TableCell
                            className={
                                e.AppointmentStatus === 'Approved'
                                    ? 'text-green-500'
                                    : e.AppointmentStatus === 'Rejected'
                                        ? 'text-red-500'
                                        : 'text-blue-500' // Default for 'Pending' or other statuses
                            }
                        >
                            {e.AppointmentStatus}
                        </TableCell>
                        <TableCell>{e.Date.getUTCDate()}-{e.Date.toLocaleString('default', { month: 'long' })}-{e.Date.getUTCFullYear()}</TableCell>
                        <TableCell>{e.physician}</TableCell>
                        <TableCell className="text-right">
                            <Dialog open={open1} onOpenChange={setOpen1}>

                                <DialogTrigger asChild>
                                    <Button variant="outline" onClick={()=>scheduleopener(e.physician)}>Schedule</Button>
                                </DialogTrigger>
                                <DialogboxSchedule key={e.id} title='enter' description='Select date and add remarks for scheduling an appointment' id={e.id} physician={e.physician} setOpen={setOpen1} />
                            </Dialog>
                            <Dialog open={open2} onOpenChange={setOpen2}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" onClick={() => setOpen2(true)}>Cancel</Button>
                                </DialogTrigger>
                                <DialogboxCancel key={e.id} setOpen={setOpen2} title='enter' description='Select date and add remarks for scheduling an appointment' id={e.id} />
                            </Dialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </>
    )
}


