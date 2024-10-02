import { signIn } from "@/app/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user = await prisma.user.findUnique({
      where: {
        email,
        password,
      },
    });
    console.log(user, "user");
      if(user){
      const signin = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log(signin,'09324823498324984294');
      if (signin) {
        return NextResponse.json({user,signin }, { status: 201 });
      } else {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }
    }
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(err, { status: 500 });
  }
}
