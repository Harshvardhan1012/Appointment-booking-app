import Image from "next/image";
import { Doctors } from "../constants";
import { StatCard } from "@/components/ui/StatCard";
import { appointmentcount } from "@/lib/action/appointment.action";
import { appointmentfind } from "@/lib/action/appointment.action";
import { DataTable } from "@/components/forms/table/DataTable";
import { columns } from "@/components/forms/table/columns";


export default async function page() {

  const appointment = await appointmentfind();
  const count = await appointmentcount();

  console.log("allleeddddddddddddddddddddddddddddddd");

  if (!count) {
    return <h1>no count</h1>
  }
  if (!appointment) {
    return <h1>no appointmetn</h1>
  }

  return (
    <div>
      <nav className="text-white flex justify-between items-center p-3 h-[70px] bg-dark-200  rounded-3xl ">
        <div className="text-xl font-bold">Admin Page</div>
        <div className="flex flex-row items-center justify-center gap-3">
          {
            <>
              <Image src={Doctors[0].image} width={40} height={30} alt="doctor" />
              <div>{Doctors[0].name}</div>
            </>
          }
        </div>
      </nav>
      <div className="h-[80px] flex justify-center items-start px-10 gap-3 text-white flex-col mt-7">
        <div className="text-3xl font-bold">Welcome, Admin</div>
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
        <DataTable columns={columns} data={appointment} />
      </div>
    </div >
  )
}
