import { signIn } from "@/app/auth";
import prisma from "@/lib/db";
import { redirect } from "next/dist/server/api-utils";
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
    if (user) {
      const signin = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (signin) {
        return NextResponse.json({ user, signin }, { status: 201 });
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
    return NextResponse.json(err, { status: 500 });
  }
}
