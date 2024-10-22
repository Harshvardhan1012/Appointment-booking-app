'use server';
import prisma from '@/lib/db';
import { Appointment, Prisma, Status } from '@prisma/client';
import { createTransport } from 'nodemailer';
import { IstDate } from '@/lib/utils';

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

const transport = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

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
          },
        },
      },
    });

    await transport.sendMail({
      to: appointment.user.email,
      from: process.env.EMAIL_FROM,
      subject: `Appointment Requested with physician ${appointment.physician?.name}`,
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1e90ff;">Appointment Requested</h2>
            <p>Dear user,</p>
            <p>You have successfully submitted an appointment request with the physician <strong>${appointment.physician?.name}</strong>.</p>
            <p>The appointment requested date is : <strong style="color: #1e90ff;">${formattedDate}</strong></p>
            <br />
            <p>Thank you</p>
          </div>
        `,
    });

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

    if (appointment.AppointmentStatus === 'Approved' && data.expectedDate) {
      const formattedDate = IstDate(data.expectedDate);
      await transport.sendMail({
        to: appointment.user?.email, // Recipient's email
        from: process.env.EMAIL_FROM, // Sender's email
        subject: `Appointment confirmed by Physician ${appointment.physician?.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Appointment Confirmed</h2>
            <p>Dear ${appointment.user.name},</p>
            <p>Your appointment with Physician <strong>${appointment.physician?.name}</strong> has been confirmed on <strong>${formattedDate}</strong>.</p>
            <p><strong>Remarks:</strong> ${data.remarks}</p>
            <p>Thank you for choosing our service!</p>
            <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply.</p>
          </div>
        `,
      });
    } else if (appointment.AppointmentStatus === 'Rejected') {
      await transport.sendMail({
        to: appointment.user?.email,
        from: process.env.EMAIL_FROM,
        subject: `Appointment with physician ${appointment.physician?.name} cancelled`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #F44336;">Appointment Cancelled</h2>
            <p>Dear ${appointment.user.name},</p>
            <p>Unfortunately, your appointment with physician <strong>${appointment.physician?.name}</strong> has been cancelled.</p>
            <p><strong>Cancellation Reason:</strong> ${data.remarks}</p>
            <p>We apologize for any inconvenience caused.</p>
            <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply.</p>
          </div>
        `,
      });
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
