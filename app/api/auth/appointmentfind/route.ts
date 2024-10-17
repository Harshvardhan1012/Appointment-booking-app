import { auth } from "@/app/auth";
import prisma from "@/lib/db";
import { Status } from "@prisma/client";
import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";


const transport = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
})


export async function PUT(req: Request) {
  const session = await auth();
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

    const date = new Date(appointment.Date);

    // Get day, month, and year
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear();
    const user = await prisma.user.findUnique({
      where: {
        id: appointment.userId,
      },
    });
    const Admin = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    });
    if (appointment.AppointmentStatus === 'Approved') {
      await transport.sendMail({
      to: user?.email, // Recipient's email
      from: process.env.EMAIL_FROM, // Sender's email
      subject: `Appointment confirmed by physician ${Admin?.name}`,
      text: `Your appointment with physician ${Admin?.name} has been confirmed on ${day}-${month}-${year}.`,
    });
  } else if (appointment.AppointmentStatus === 'Rejected') {
    await transport.sendMail({
      to: user?.email,
      from: process.env.EMAIL_FROM,
      subject: `Appointment with physician ${Admin?.name} cancelled`,
      text: `Unfortunately, your appointment with physician ${Admin?.name} on ${day}-${month}-${year} has been cancelled.`,
    })
  }
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ message: 'Error updating appointment' });
  }

}


