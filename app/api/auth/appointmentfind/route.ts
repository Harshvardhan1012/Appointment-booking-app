import prisma from "@/lib/db";
import { Status } from "@prisma/client";

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


export const appointmentupdate = async (appointmentId: number, status: Status) => {
  try {
    const appointment = await prisma.appointment.update({
      where: {
        id: Number(appointmentId),
      },
      data: {
        AppointmentStatus: status,
      },
    });
    console.log(appointment,'dsfkdskjfkjfkjfdkjfdsf');
    return appointment;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
}