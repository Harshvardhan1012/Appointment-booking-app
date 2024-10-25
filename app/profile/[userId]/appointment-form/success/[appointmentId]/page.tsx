import Image from 'next/image';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { appointmentfindUser } from './../../../../../../lib/action/appointment.action';
import { statusMap } from '@/app/constants';
import { Button } from '@/components/ui/button';




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
        <div className="mt-6 gap-3">
          <Link href={`/profile/${userId}/appointment-form`}>
            <button
              type="button"
              className="focus:outline-none text-white bg-green-700 w-full font-medium rounded text-sm px-5 py-2"
            >
             Schedule New Appointment
            </button>
          </Link>
          <Link href={`/profile/${userId}/manage`}>
              <Button className="bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full mt-4">
                Manage Appointments
              </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
