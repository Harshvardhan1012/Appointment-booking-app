// "use server"
import prisma from "@/lib/db";
import { formSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, password, phone } = await req.json(); // Parse JSON from the request body

    // Create the user with Prisma
    const user = await prisma.user.create({
      data: {
        email,
        password,
        phone,
      },
    });

    console.log(user);
   
    return NextResponse.json({ user }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002")
        return NextResponse.json({message:"email or phone already used"}, { status: 409 });
    }
    console.error("Error creating user:", e);
    return NextResponse.json({ e }, { status: 500 });
  }
}
