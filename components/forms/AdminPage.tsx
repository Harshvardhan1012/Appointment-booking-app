"use client"
import React from 'react'
import { TableBody, TableCell, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { appointmentupdate } from '@/app/api/auth/appointmentfind/route'
import { InferGetServerSidePropsType } from 'next'

export default function AdminPage({appointment,schedule}:{appointment:any,schedule: InferGetServerSidePropsType<typeof getServerSideProps>}) {


    console.log(schedule,'342222222222222222222222222222222222222222222222222');
    const schedular = async() => {   
        const schedule=await appointmentupdate(appointment.id,'Approved');
        console.log(schedule);
    }

    const cancelappointment = async() => {
        const cancel=await appointmentupdate(appointment.id,"Rejected");
        console.log(cancel);
    }
    return (
        <TableBody>
            {appointment.map((e:any) => (
                <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.userId}</TableCell>
                    <TableCell>{e.AppointmentStatus}</TableCell>
                    <TableCell>{e.Date.getUTCDate()}-{e.Date.toLocaleString('default', { month: 'long' })}-{e.Date.getUTCFullYear()}</TableCell>
                    <TableCell>{e.physician}</TableCell>
                    <TableCell className="text-right">
                        <Button className=" text-green-500" onClick={schedular}>Schedule</Button>
                        <Button className="text-red-500" onClick={cancelappointment}>Cancel</Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}


export const getServerSideProps = (async (appointmentId:number) => {
    // Fetch data from external API
    const schedule=await appointmentupdate(appointmentId,'Approved');
    console.log(schedule);
    // Pass data to the page via props
    return { props: { schedule } }
  }) 