import { auth } from "@/app/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import success from "./../../../../../../public/assets/icons/check-circle.svg";
import Link from "next/link";
import { appointmentfind } from "@/app/api/auth/appointmentfind/route";


export default async function Page({ params }: { params: { userId: number, appointmentId: number } }) {

  const { userId, appointmentId } = params;
  const session = await auth();
  console.log("appointmentId", params.appointmentId);
  console.log("search", params.userId);
  if (session?.user?.id !== userId.toString()) {
    //page not found redirect 
    redirect('/login');
  }


 const appointment = await appointmentfind(Number(appointmentId));
  console.log(appointment);
  if (!appointment) {
    redirect('/profile/' + userId + '/appointment-form');
  }
  const date = new Date(appointment.Date);

  // Get day, month, and year
  const day = date.getUTCDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getUTCFullYear();

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className="w-[600px] items-center text-white flex justify-center flex-col">
        <Image src={success} width={100} height={100} alt="success" />
        <div className="text-green-400 items-center flex justify-center text-center">Your appointment request has been successfully submitted</div>

        <div className="text-white-700 text-base mb-2 mt-6">
          <span className="font-medium">Doctor:</span> Dr. {appointment.physician}
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
