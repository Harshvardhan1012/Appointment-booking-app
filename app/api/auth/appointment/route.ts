import { auth } from '@/app/auth';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';

const transport = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const session = await auth();
    if (!body.physician || !body.Reason || !body.Date) {
      return NextResponse.json({ message: 'invalid inputs' });
    }

    const date = new Date(body.Date);

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    };
    const formattedDate = date
      .toLocaleDateString('en-GB', options)
      .replace(',', '');

      console.log(formattedDate,"formatted date")

    const appointment = await prisma.appointment.create({
      data: {
        physicianId: body.physician,
        Reason: body.Reason,
        Date: formattedDate,
        userId: session?.user?.id as string,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: appointment.physicianId,
      },
    });

    await transport.sendMail({
      to: session?.user.email,
      from: process.env.EMAIL_FROM,
      subject: `Appointment Requested with physician ${user?.name}`,
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1e90ff;">Appointment Requested</h2>
            <p>Dear user,</p>
            <p>You have successfully submitted an appointment request with the physician <strong>${user?.name}</strong>.</p>
            <p>The appointment requested date is : <strong style="color: #1e90ff;">${formattedDate}</strong></p>
            <br />
            <p>Thank you</p>
          </div>
        `,
    });

    return NextResponse.json(
      { message: 'appointment requested', appointment },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Appointment with this physician already exists' },
          { status: 400 },
        );
      } else if (error.code === 'P1013') {
        return NextResponse.json(
          { error: 'Invalid input data' },
          { status: 400 },
        );
      } else {
        return NextResponse.json(
          { error: 'Unexpected connection error' },
          { status: 500 },
        );
      }
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return NextResponse.json({ error: 'Network error' }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
    }
  }
}
