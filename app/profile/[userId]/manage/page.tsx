import { auth } from "@/app/auth";
import { columnUser } from "@/components/forms/table/columns";
import { DataTable } from "@/components/forms/table/DataTable";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/StatCard";
import { userAppointmentCount, userAppointments } from "@/lib/action/appointment.action";
import Link from "next/link";

export default async function page({ params }: { params: { userId: string } }) {
  const [session, appointments, count] = await Promise.all([
    auth(),
    userAppointments(params.userId),
    userAppointmentCount(params.userId),
  ]);

  if (!appointments) {
    return <h1>No appointment found</h1>;
  }

  if (!count) {
    return <h1>no count</h1>;
  }


  return (
    <div>
      <div className="h-[80px] flex justify-center items-start px-10 gap-3 text-white flex-col mt-28">
        <div className="text-3xl font-bold">Welcome,{session?.user.name}</div>
        <div className="text-sm">Manage appointments here</div>
        <Link href={`/profile/${params.userId}/appointment-form`}>

          <Button className="bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-1 w-full mb-5">
            Schedule New Appointment
          </Button>

        </Link>
      </div>
      <div className="flex  justify-center items-center gap-4 h-[152px] px-4">
        <StatCard
          type="appointments"
          count={count.ApprovedCount}
          label="Scheduled appointments"
          icon={'/assets/icons/appointments.svg'}
        />
        <StatCard
          type="pending"
          count={count.PendingCount}
          label="Pending appointments"
          icon={'/assets/icons/pending.svg'}
        />
        <StatCard
          type="cancelled"
          count={count.RejectedCount}
          label="Cancelled appointments"
          icon={'/assets/icons/cancelled.svg'}
        />
      </div>
      <div className="px-5 text-white">
        <DataTable
          columns={columnUser}
          data={appointments}
        />
      </div>
    </div>
  );
}
