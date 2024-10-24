'use server';
import prisma from '@/lib/db';
import { Appointment, Prisma, Status } from '@prisma/client';
import { IstDate } from '@/lib/utils';
import { sendAppointmentEmail } from '@/app/constants';




export async function findAppointments(id: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        physicianId: id,
      },
      include: {
        user: {
          select: {
            name: true, // Fetches the user's name
          },
        },
        physician: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: 'asc', // Orders by appointment id in ascending order
      },
    });

    console.log(appointments, 'appointments');
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return false;
  }
}

//appointment count for super admin
export const appointmentCount = async (): Promise<
  | false
  | {
      PendingCount: number;
      ApprovedCount: number;
      RejectedCount: number;
    }
> => {
  try {
    const appointmentCounts = await prisma.appointment.groupBy({
      by: ['AppointmentStatus'],
      _count: {
        AppointmentStatus: true,
      },
      where: {
        AppointmentStatus: {
          in: ['Pending', 'Approved', 'Rejected'],
        },
      },
    });

    const countMap = appointmentCounts.reduce(
      (acc, item) => ({
        ...acc,
        [`${item.AppointmentStatus}Count`]: item._count.AppointmentStatus,
      }),
      { PendingCount: 0, ApprovedCount: 0, RejectedCount: 0 }
    );

    return countMap;
  } catch (error) {
    console.error('Error fetching appointment counts:', error);
    return false;
  }
};


//coount for admin(doctor)
export const adminAppointmentCount = async (
  id: string
): Promise<
  | false
  | {
      PendingCount: number;
      ApprovedCount: number;
      RejectedCount: number;
    }
> => {
  try {
    const counts = await prisma.appointment.groupBy({
      by: ['AppointmentStatus'],
      where: {
        physicianId: id,
        AppointmentStatus: {
          in: ['Pending', 'Approved', 'Rejected'],
        },
      },
      _count: {
        AppointmentStatus: true,
      },
    });

    // Use reduce to dynamically map counts
    const countMap = counts.reduce(
      (acc, item) => ({
        ...acc,
        [`${item.AppointmentStatus}Count`]: item._count.AppointmentStatus,
      }),
      { PendingCount: 0, ApprovedCount: 0, RejectedCount: 0 }
    );

    return countMap;
  } catch (error) {
    console.error('Error fetching appointment counts:', error);
    return false;
  }
};

export const appointmentfind = async (): Promise<Appointment[] | false> => {
  try {
    const appointments = await prisma.appointment.findMany();
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return false;
  }
};

export const appointmentfindUser = async (appointmentId: number) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
      include: {
        physician: {
          select: {
            name: true,
          },
        },
      },
    });

    return appointment;
  } catch (err) {
    console.error('Error creating user:', err);
    return false;
  }
};

export async function requestAppointment(data: {
  physician: string;
  Reason: string;
  Date: Date;
  userId: string;
}) {
  try {
    if (!data.physician || !data.Reason || !data.Date) {
      return { message: 'invalid inputs' };
    }

    const formattedDate = IstDate(data.Date);
    const appointment = await prisma.appointment.create({
      data: {
        physicianId: data.physician,
        Reason: data.Reason,
        Date: formattedDate,
        userId: data.userId,
      },
      include: {
        physician: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

   sendAppointmentEmail(appointment, "", formattedDate);

    return { message: 'success', appointment };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { error: 'Appointment with this physician already exists' };
      } else if (error.code === 'P1013') {
        return { error: 'Invalid input data' };
      } else {
        return { error: 'Unexpected connection error' };
      }
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return { error: 'Network error' };
    } else {
      return { error: 'Unexpected error' };
    }
  }
}

export async function updateAppointment(data: {
  appointmentId: number;
  status: Status;
  remarks: string;
  expectedDate?: Date;
}) {
  if (!data.appointmentId || !data.status || !data.remarks) {
    return { message: 'Missing values', status: 400 };
  }

  try {
    const appointment = await prisma.appointment.update({
      where: {
        id: data.appointmentId,
      },
      data: {
        AppointmentStatus: data.status,
      },
      include: {
        user: true, 
        physician: true,
      },
    });

    if (appointment.AppointmentStatus === 'Approved' && data.expectedDate && appointment.user?.name) {
      const formattedDate = IstDate(data.expectedDate);
      sendAppointmentEmail(appointment,data.remarks, formattedDate);  
    } else if (appointment.AppointmentStatus === 'Rejected') {
      sendAppointmentEmail(appointment, data.remarks);
    }

    return {
      message: 'Appointment updated successfully',
      appointment,
      status: 200,
    };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { message: 'Error updating appointment', status: 500 };
  }
}
