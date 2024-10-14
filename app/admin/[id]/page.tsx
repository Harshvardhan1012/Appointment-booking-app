import { StatCard } from "@/components/ui/StatCard";
import { doctorAppointmentCount, doctorName, findDoctor } from "@/lib/action/appointment.action";
import { DataTable } from "@/components/forms/table/DataTable";
import { columns } from "@/components/forms/table/columns";


export default async function page({ params }: { params: { id: number } }) {


    const DoctorName=await doctorName(Number(params.id));
    if(!DoctorName){
        return <h1>Doctor not found</h1>
    }
    const appointment = await findDoctor(Number(params.id));

    if(!appointment){
        return <h1>No appointment found</h1>
    }
    const count = await doctorAppointmentCount(Number(params.id));

    if (!count) {
        return <h1>no count</h1>
    }


    const updatedAppointments = appointment.map((item) => ({
        ...item,
        adminName: DoctorName, // Add doctorName to each data entry
      }));

    return (
        <div>
            
            <div className="h-[80px] flex justify-center items-start px-10 gap-3 text-white flex-col mt-20">
                <div className="text-3xl font-bold">Welcome,{DoctorName}</div>
                <div className="text-sm">Manage appointments here</div>

            </div>
            <div className="flex  justify-center items-center gap-4 h-[152px] px-4">
                <StatCard
                    type="appointments"
                    count={count.ApprovedCount}
                    label="Scheduled appointments"
                    icon={"/assets/icons/appointments.svg"}
                />
                <StatCard
                    type="pending"
                    count={count.PendingCount}
                    label="Pending appointments"
                    icon={"/assets/icons/pending.svg"}
                />
                <StatCard
                    type="cancelled"
                    count={count.CancelledCount}
                    label="Cancelled appointments"
                    icon={"/assets/icons/cancelled.svg"}
                />
            </div>
            <div className="px-5 text-white">
                <DataTable columns={columns} data={updatedAppointments} />
            </div>
        </div >
    )
}
