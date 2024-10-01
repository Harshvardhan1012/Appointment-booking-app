import { auth } from "@/app/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (session) {
      await prisma.profile.findUnique({
        where: {
          userId: Number(session?.user?.id),
        },
      });

      
        return NextResponse.json({ message: "profile find" }, { status: 200 });
    } else {
      redirect("/login");
    }
  } catch (e) {
    console.log("error", e);
    return NextResponse.json({ e }, { status: 400 });
  }
}
