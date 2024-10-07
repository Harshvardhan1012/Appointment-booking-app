import prisma from "@/lib/db";
import { Status } from "@prisma/client";
import { NextResponse } from "next/server";



export async function PUT(req: Request) {
  const { appointmentId, status } = await req.json();
  if (!appointmentId || !status) {
    return NextResponse.json({ message: 'Missing appointmentId or status' },{status:400});
  }

  try {
    const appointment = await prisma.appointment.update({
      where: {
        id: Number(appointmentId),
      },
      data: {
        AppointmentStatus: status as Status,
      },
    });
    console.log(appointment, 'Appointment updated successfully');
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ message: 'Error updating appointment' });
  }

}


