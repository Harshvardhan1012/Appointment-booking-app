import Image from "next/image";
import { Doctors } from "../constants";
import { StatCard } from "@/components/ui/StatCard";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { appointmentfind } from "../api/auth/appointment/route";
import { Button } from "@/components/ui/button";
import { appointmentcount } from "../api/auth/appointmentfind/route";
import AdminPage from "@/components/forms/AdminPage";

export default async function page() {

  const appointment = await appointmentfind();
  const count=await appointmentcount();

  if(!count){
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
      <div className="flex justify-center items-center gap-4 h-[152px] px-5">
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
        <Table className="">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">userID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-left">Physician</TableHead>
              <TableHead className="text-right">Actions</TableHead>

            </TableRow>
          </TableHeader>
          <AdminPage appointment={appointment} />
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </div>




    </div >
  )
}
