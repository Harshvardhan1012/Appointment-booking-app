import { createTransport } from "nodemailer";

export const StatusIcon = {
  scheduled: '/assets/gifs/success.gif',
  pending: '/assets/icons/pending.svg',
  cancelled: '/assets/icons/cancelled.svg',
};

export const statusMap = {
  Rejected: {
    color: 'text-red-400',
    message: 'Your appointment request has been Cancelled',
    image: { src: StatusIcon.cancelled, width: 70, height: 70, alt: 'rejected',unoptimized:true },
  },
  Approved: {
    color: 'text-green-500',
    message: 'Your appointment request has been Approved',
    image: { src: StatusIcon.scheduled, width: 100, height: 100, alt: 'success' },
  },
  Pending: {
    color: 'text-blue-500',
    message: 'Your appointment request has been successfully submitted',
    image: { src: StatusIcon.pending, width: 50, height: 50, alt: 'pending' },
  },
};


const transport = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

type appointment={
  user:{
    email:string | null;
    name:string | null;
  };
  physician?:{
    name:string | null;
  };
  AppointmentStatus: 'Approved' | 'Rejected' | 'Pending';
}

export const sendAppointmentEmail = async (appointment:appointment,remarks:string, formattedDate?:string) => {
  // Set common email properties
  const recipientEmail = appointment.user?.email!;
  const senderEmail = process.env.EMAIL_FROM;
  let subject = '';
  let htmlContent = '';

  // Check the appointment status and customize the email content accordingly
  switch (appointment.AppointmentStatus) {
    case 'Approved':
      subject = `Appointment confirmed by Physician ${appointment.physician?.name}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">Appointment Confirmed</h2>
          <p>Dear ${appointment.user?.name},</p>
          <p>Your appointment with Physician <strong>${appointment.physician?.name}</strong> has been confirmed on <strong>${formattedDate}</strong>.</p>
          <p><strong>Remarks:</strong> ${remarks}</p>
          <p>Thank you for choosing our service!</p>
          <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply.</p>
        </div>
      `;
      break;

    case 'Rejected':
      subject = `Appointment with physician ${appointment.physician?.name} cancelled`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #F44336;">Appointment Cancelled</h2>
          <p>Dear ${appointment.user?.name},</p>
          <p>Unfortunately, your appointment with physician <strong>${appointment.physician?.name}</strong> has been cancelled.</p>
          <p><strong>Cancellation Reason:</strong> ${remarks}</p>
          <p>We apologize for any inconvenience caused.</p>
          <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply.</p>
        </div>
      `;
      break;

    case 'Pending':
      subject = `Appointment Requested with physician ${appointment.physician?.name}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #1e90ff;">Appointment Requested</h2>
          <p>Dear ${appointment.user.name},</p>
          <p>You have successfully submitted an appointment request with the physician <strong>${appointment.physician?.name}</strong>.</p>
          <p>The appointment requested date is: <strong style="color: #1e90ff;">${formattedDate}</strong></p>
          <br />
          <p>Thank you</p>
        </div>
      `;
      break;

    default:
      throw new Error('Invalid appointment status');
  }

  // Send the email using transport
  await transport.sendMail({
    to: recipientEmail,
    from: senderEmail,
    subject: subject,
    html: htmlContent,
  });
};

