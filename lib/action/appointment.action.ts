"use server";
import prisma from "@/lib/db";


export const doctorName=async(id:string)=>{
  try{
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  console.log(user?.name,"user?.name");
  return user?.name
  }
 catch(error){
  return false;
}
}

export async function findDoctor(id:string) {
  try {
   
    const appointments = await prisma.appointment.findMany({
      where: {
        physicianId:id,
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

export const doctorAppointmentCount = async (id:string) => {
  try {

  
    const PendingCount = await prisma.appointment.count({
      where: {
        physicianId: id,
        AppointmentStatus: "Pending",
      },
    });
    const ApprovedCount = await prisma.appointment.count({
      where: {
        physicianId: id,
        AppointmentStatus: "Approved",
      },
    });
    const CancelledCount = await prisma.appointment.count({
      where: {
        physicianId: id,
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


export async function appointmentfind() {

  try {
    const appointments = await prisma.appointment.findMany();
   return appointments;
    
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return false;
  }
} 


export const appointmentfindUser = async (appointmentId: number) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: Number(appointmentId),
      },
    });
    const user = await prisma.user.findUnique({
      where: {
        id: appointment?.physicianId,
      },
    });
    
    if (appointment) {
      return {
        user: user?.name,
        appointment,
      };
    }
    return false;
  } catch (err) {
    console.error("Error creating user:", err);
    return false;
  }
};

