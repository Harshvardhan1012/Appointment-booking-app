import { auth } from '@/app/auth';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse JSON from the request body

    const session = await auth();

    const user = await prisma.profile.create({
      data: {
        user: {
          connect: { id: session?.user?.id }, // Assuming userId is provided in the request body
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
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { message: 'Profile already exists for this user' },
          { status: 409 }, // Conflict
        );
      }

      console.error('Error creating user:', error);
      return NextResponse.json(
        { message: 'Internal server error', error: error.message },
        { status: 500 },
      );
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return NextResponse.json({ error: 'Network error' }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
    }
  }
}
