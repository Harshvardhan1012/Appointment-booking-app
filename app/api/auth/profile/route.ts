import { auth } from "@/app/auth";
import prisma from "@/lib/db";
// import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from 'next/server';



export async function POST(req: NextRequest) {
   
  try {
    const body = await req.json(); // Parse JSON from the request body

    const session = await auth();

    // if (!session) {
    //   return redirect("/login");
    // }

    // Create the user with Prisma
    const user = await prisma.profile.create({
      data: {
        user: {
          connect: { id: session?.user?.id } // Assuming userId is provided in the request body
        },
        name: body.name,
        email: body.email,
        phone: body.phone,
        gender: body.gender,
        dob: body.dob,
        Address: body.Address,
        Occupation: body.Occupation,
        identificationDocument: body.identificationDocument,
        InsuranceId: body.InsuranceId,
        InsuranceProvider: body.InsuranceProvider,
        Allergies: body.Allergies,
        CurrentMedications: body.CurrentMedications,
      },
    });

    
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}

