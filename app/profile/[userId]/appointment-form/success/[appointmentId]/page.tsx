import Image from "next/image";
import { redirect } from "next/navigation";
import success from "./../../../../../../public/assets/icons/check-circle.svg";
import cancelled from "./../../../../../../public/assets/icons/cancelled.svg";
import pending from "./../../../../../../public/assets/icons/pending.svg";
import Link from "next/link";
import { appointmentfindUser } from "./../../../../../../lib/action/appointment.action";


export default async function Page({ params }: { params: { userId: number, appointmentId: number } }) {

  const { userId, appointmentId } = params;

  const appointment = await appointmentfindUser(appointmentId);
  if (!appointment) {
    redirect('/profile/' + userId + '/appointment-form');
  }
  const date = new Date(appointment.appointment.Date);

  // Get day, month, and year
  const day = date.getUTCDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getUTCFullYear();

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className="w-[600px] items-center text-white flex justify-center flex-col gap-3">

        {
          appointment.appointment.AppointmentStatus === 'Rejected' && (
            <>
              <Image src={cancelled} width={70} height={70} alt="rejected" />

              <div className="text-red-400 items-center flex justify-center text-center">Your appointment request has been Cancelled</div>

            </>
          )
        }
        {
          appointment.appointment.AppointmentStatus === "Approved" && (
            <>
              <Image src={success} width={100} height={100} alt="success" />

              <div className="text-green-500 items-center flex justify-center text-center">Your appointment request has been Approved</div>

            </>
          )
        }
        {
          appointment.appointment.AppointmentStatus === "Pending" && (
            <>
              <Image src={pending} width={50} height={50} alt="success" />

              <div className="text-blue-500 items-center flex justify-center text-center">Your appointment request is Submitted</div>

            </>
          )
        }
        <div className="text-white-700 text-base mb-2 mt-6">
          <span className="font-medium">Doctor:</span> Dr. {appointment.user}
        </div>

        <div className="text-white-700 text-base mb-2">
          <span className="font-medium">Date:</span> {day}-{month}-{year}
        </div>
        <div className="mt-6">

          <Link href={`/profile/${userId}/appointment-form`}>
            <button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">New Appointment</button>
          </Link>

        </div>
      </div>
    </div>
  )
}
