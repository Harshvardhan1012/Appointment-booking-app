import { StatCard } from '@/components/ui/StatCard';
import {
  adminAppointmentCount,
  findAppointments,
} from '@/lib/action/appointment.action';
import { DataTable } from '@/components/forms/table/DataTable';
import { columns } from '@/components/forms/table/columns';
import { auth } from '@/app/auth';

export default async function page({ params }: { params: { id: string } }) {
  const [session, appointment, count] = await Promise.all([
    auth(),
    findAppointments(params.id),
    adminAppointmentCount(params.id),
  ]);

  if (!appointment) {
    return <h1>No appointment found</h1>;
  }

  if (!count) {
    return <h1>no count</h1>;
  }


  return (
    <div>
      <div className="h-[80px] flex justify-center items-start px-10 gap-3 text-white flex-col mt-20">
        <div className="text-3xl font-bold">Welcome,{session?.user.name}</div>
        <div className="text-sm">Manage appointments here</div>
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
        <DataTable columns={columns} data={appointment} />
      </div>
    </div>
  );
}
