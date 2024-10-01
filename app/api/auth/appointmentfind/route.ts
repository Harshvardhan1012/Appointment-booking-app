import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const getappointment = await prisma.appointment.findUnique({
      where: {
        id: body.appointmentId,
      },
    });

    return NextResponse.json({ getappointment }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
