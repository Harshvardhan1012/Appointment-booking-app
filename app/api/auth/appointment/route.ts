import { auth } from "@/app/auth";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client/edge";
import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";


const transport = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
})


export async function POST(req: Request) {
  const body = await req.json();
  try {
    const session = await auth();
    if(!body.physician || !body.Reason){
      return NextResponse.json({message:'invalid inputs'});
    }
   const appointment= await prisma.appointment.create({
      data: {
        physicianId: body.physician,
        Reason: body.Reason,
        Date: body.Date,
        userId: session?.user?.id as string, // Assuming userId is provided in the request body
      },
    });
    const user=await prisma.user.findUnique({
      where:{
        id:appointment.physicianId
      }
    })
    await transport.sendMail({
      to: session?.user.email,
      from: process.env.EMAIL_FROM,
      subject: `Appointment Requested with physician ${user?.name}`,
      // text: `Appointment requested with physician ${body.physician}`,
      text: `Appointment requested by user ${session?.user.name}  on date ${new Date().getDate()}-${new Date().getMonth()+1}-${new Date().getFullYear()}`,
    });

    return NextResponse.json({message:'appointment requested',appointment}, { status: 201 });
  } catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {   
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Appointment with this physician already exists" },
        { status: 400 }
      );
    } else if (error.code === "P1013") {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: "Unexpected connection error" },
        { status: 500 }
      );
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return NextResponse.json(
      { error: "Network error" },
      { status: 500 }
    );
  } else {
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
  }
}



