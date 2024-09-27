import prisma from "@/lib/db";
import { appointmentformschema } from "@/lib/validation";
import { NextResponse } from 'next/server';



export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse JSON from the request body

        const result = appointmentformschema.safeParse(body);

        console.log(result);
        if(!result.success) {
            return NextResponse.json({ message: 'Invalid data', errors: result.error.errors }, { status: 400 });
        }

        // Create the user with Prisma
        const user = await prisma.appointment.create({
            data: {
                physician: body.physician,
                Date: body.Date,
                Reason: body.Reason,
                user: {
                    connect: { id: 7 } // Assuming body contains userId to connect the user
                }
            },
        });
        // const jwtsign=jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'harsh', { expiresIn: '1h' });


        

        return NextResponse.json({user}, { status: 201 });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
    }
}
