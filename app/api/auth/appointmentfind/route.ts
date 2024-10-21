import { auth } from '@/app/auth';
import prisma from '@/lib/db';
import { Status } from '@prisma/client';
import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';

const transport = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function PUT(req: Request) {
  const session = await auth();
  const { appointmentId, status, remarks, expectedDate } = await req.json();
  if (!appointmentId || !status || !remarks) {
    return NextResponse.json({ message: 'Missing values' }, { status: 400 });
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
    const user = await prisma.user.findUnique({
      //user.name to be added in table using profile table
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
      const date = new Date(expectedDate);

      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      };
      const formattedDate = date
        .toLocaleDateString('en-GB', options)
        .replace(',', '');

      await transport.sendMail({
        to: user?.email, // Recipient's email
        from: process.env.EMAIL_FROM, // Sender's email
        subject: `Appointment confirmed by Physician ${Admin?.name}`,
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Appointment Confirmed</h2>
        <p>Dear user,</p>
        <p>Your appointment with Physician <strong>${Admin?.name}</strong> has been confirmed on <strong>${formattedDate}</strong>.</p>
        <p><strong>Remarks:</strong> ${remarks}</p>
        <p>Thank you for choosing our service!</p>
        <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply.</p>
      </div>
    `,
      });
    } else if (appointment.AppointmentStatus === 'Rejected') {
      await transport.sendMail({
        to: user?.email,
        from: process.env.EMAIL_FROM,
        subject: `Appointment with physician ${Admin?.name} cancelled`,
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #F44336;">Appointment Cancelled</h2>
        <p>Dear user,</p>
        <p>Unfortunately, your appointment with physician <strong>${Admin?.name}</strong> has been cancelled.</p>
        <p><strong>Cancellation Reason:</strong> ${remarks}</p>
        <p>We apologize for any inconvenience caused.</p>
        <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply.</p>
      </div>
    `,
      });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ message: 'Error updating appointment' });
  }
}
