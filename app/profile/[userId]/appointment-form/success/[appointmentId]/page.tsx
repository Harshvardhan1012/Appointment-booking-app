import Image from 'next/image';
import { redirect } from 'next/navigation';
import success from './../../../../../../public/assets/icons/check-circle.svg';
import cancelled from './../../../../../../public/assets/icons/cancelled.svg';
import pending from './../../../../../../public/assets/icons/pending.svg';
import Link from 'next/link';
import { appointmentfindUser } from './../../../../../../lib/action/appointment.action';


const statusMap = {
  Rejected: {
    color: 'text-red-400',
    message: 'Your appointment request has been Cancelled',
    image: { src: cancelled, width: 70, height: 70, alt: 'rejected' },
  },
  Approved: {
    color: 'text-green-500',
    message: 'Your appointment request has been Approved',
    image: { src: success, width: 100, height: 100, alt: 'success' },
  },
  Pending: {
    color: 'text-blue-500',
    message: 'Your appointment request has been successfully submitted',
    image: { src: pending, width: 50, height: 50, alt: 'pending' },
  },
};

export default async function Page({
  params,
}: {
  params: { userId: string; appointmentId: number };
}) {
  const { userId, appointmentId } = params;


  const appointment = await appointmentfindUser(Number(appointmentId));
  if (!appointment) {
    redirect(`/profile/${userId}/appointment-form`);
  }

  const { AppointmentStatus, Date } = appointment;
  const status = statusMap[AppointmentStatus];

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[600px] items-center text-white flex justify-center flex-col gap-3">
        {status && (
          <>
            <Image {...status.image} />
            <div className={`${status.color} items-center flex justify-center text-center`}>
              {status.message}
            </div>
          </>
        )}
        <div className="text-white-700 text-base mb-2 mt-6">
          <span className="font-medium">Doctor:</span> Dr. {appointment.physician.name}
        </div>
        <div className="text-white-700 text-base mb-2">
          <span className="font-medium">Date:</span> {Date}
        </div>
        <div className="mt-6">
          <Link href={`/profile/${userId}/appointment-form`}>
            <button
              type="button"
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              New Appointment
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
