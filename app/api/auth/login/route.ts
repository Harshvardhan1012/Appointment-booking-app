// "use server"
import { signIn } from "@/app/auth";
import {  NextResponse } from "next/server";

export async function POST(req: Request) {


  try {
  const { email,password } = await req.json();
    const signin = await signIn("credentials", {  email, password,redirect:false} );

    console.log("logged in",signin);


    return NextResponse.json(signin,{status:200});
  } catch (error) {
    console.error("Sign-in error:", error);

    // Extract error details for sending to the frontend
    const errorMessage = "invalid username or password";
    const errorCode = 500; // Default error code
    return NextResponse.json(
      { error: errorMessage, code: errorCode },
      { status: errorCode }
    );


    // Send error
  }
}


// export async function POST(req: Request) {
//   try {
//     const body = await req.json(); // Parse JSON from the request body

//     const result = registerformschema.safeParse(body);
//     console.log(result);

//     if (!result.success) {
//       return NextResponse.json(
//         { message: "Invalid data", errors: result.error.errors },
//         { status: 400 }
//       );
//     }

//     // Create the user with Prisma
//     const user = await prisma.profile.create({
//       data: {
//         user: {
//           connect: { id: 7 } // Assuming userId is provided in the request body
//         },
//         name: body.name,
//         email: body.email,
//         phone: body.phone,
//         gender: body.gender,
//         dob: body.dob,
//         Address: body.Address,
//         Occupation: body.Occupation,
//         identificationDocument: body.identificationDocument,
//         InsuranceId: body.InsuranceId,
//         InsuranceProvider: body.InsuranceProvider,
//         Allergies: body.Allergies,
//         CurrentMedications: body.CurrentMedications,
//       },
//     });

//     return NextResponse.json(user, { status: 201 });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return NextResponse.json(
//       { message: "Internal server error", error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }
