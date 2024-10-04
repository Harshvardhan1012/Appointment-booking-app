import { auth } from "@/app/auth";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const session = await auth();
    console.log("SESSION", session);
   const appointment= await prisma.appointment.create({
      data: {
        physician: body.physician,
        Reason: body.Reason,
        Date: new Date(),
        user: {
          connect: { id: Number(session?.user?.id) }, // Assuming userId is provided in the request body
        },
      },
    });
    return NextResponse.json({message:'appointment requested',appointment}, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle specific Prisma errors
    if (error.code === "P2002") {
      // Unique constraint violation
      return NextResponse.json(
        { error: "Appointment with this physician already exists" },
        { status: 400 }
      );
    } else if (error.code === "P1013") {
      // Invalid input
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      );
    } else {
      // Other Prisma errors
      return NextResponse.json(
        { error: "Unexpected connection error" },
        { status: 500 }
      );
    }
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    // Network error
    return NextResponse.json(
      { error: "Network error" },
      { status: 500 }
    );
  } else {
    // Unknown error
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
  }
}



export async function appointmentfind() {

  try {
    const appointments = await prisma.appointment.findMany();
   return appointments;
    
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return false;
  }
} 