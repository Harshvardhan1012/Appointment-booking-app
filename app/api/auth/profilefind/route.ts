import prisma from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  //    console.log(body,'fdsfdfdfdfdsff');
  try {
    const user = await prisma.profile.findUnique({
      where: {
        userId: body.id,
      },
    });
    if (!user) {
      return NextResponse.json({ message: false }, { status: 404 });
    }
    return NextResponse.json({ message: true, user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 },
    );
  }
}
