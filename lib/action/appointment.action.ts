"use server";
import prisma from "@/lib/db";

export async function appointmentfind() {
  try {
    const appointments = await prisma.appointment.findMany();
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return false;
  }
}

export async function findDoctor(doctor: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        physician: doctor,
      },
    });
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return false;
  }
}

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

export const doctorAppointmentCount = async (doctor: string) => {
  try {
    const PendingCount = await prisma.appointment.count({
      where: {
        physician: doctor,
        AppointmentStatus: "Pending",
      },
    });
    const ApprovedCount = await prisma.appointment.count({
      where: {
        physician: doctor,
        AppointmentStatus: "Approved",
      },
    });
    const CancelledCount = await prisma.appointment.count({
      where: {
        physician: doctor,
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
