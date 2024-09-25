import prisma from "@/lib/db";
import {  registerformschema } from "@/lib/validation";
import {  NextResponse } from "next/server";

// Define the POST method handler
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON from the request body

    const result = registerformschema.safeParse(body);
    console.log(result);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: result.error.errors },
        { status: 400 }
      );
    }

    // Create the user with Prisma
    const user = await prisma.profile.create({
      data: {
        user: {
          connect: { id: 7 } // Assuming userId is provided in the request body
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
