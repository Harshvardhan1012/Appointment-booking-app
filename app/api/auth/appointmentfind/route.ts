import prisma from "@/lib/db";
import { Status } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const appointmentfind = async (appointmentId: number) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: Number(appointmentId),
      },
    });
    if (appointment) {
      return appointment;
    }
    return false;
  } catch (err) {
    console.error("Error creating user:", err);
    return false;
  }
};

export const appointmentcount = async () => {
  try {
    const PendingCount = await prisma.appointment.count({
      where: {
        AppointmentStatus: "Pending",
      },
    });
    const ApprovedCount = await prisma.appointment.count({
      where: {
        AppointmentStatus: "Approved",
      },
    });
    const CancelledCount = await prisma.appointment.count({
      where: {
        AppointmentStatus: "Rejected",
      },
    });
    return {
      PendingCount,
      ApprovedCount,
      CancelledCount,
    
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
};


export async function PUT(req: Request,res:NextApiResponse) {
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


