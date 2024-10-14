import { auth } from "@/app/auth";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client/edge";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const session = await auth();
    if(!body.physician || !body.Reason){
      return NextResponse.json({message:'invalid inputs'});
    }
   const appointment= await prisma.appointment.create({
      data: {
        physicianId: Number(body.physician),
        Reason: body.Reason,
        Date: new Date(),
        userId: Number(session?.user?.id), // Assuming userId is provided in the request body
      },
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



