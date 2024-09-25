import prisma from "@/lib/db";
import { formSchema } from "@/lib/validation";
import { NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
// Define the POST method handler
export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse JSON from the request body

        const result = formSchema.safeParse(body);

        console.log(result);
        if(!result.success) {
            return NextResponse.json({ message: 'Invalid data', errors: result.error.errors }, { status: 400 });
        }

        // Create the user with Prisma
        const user = await prisma.user.create({
            data: {
                name:body.name,
                email:body.email,
                phone:body.phone,
            },
        });
        const jwtsign=jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'harsh', { expiresIn: '1h' });


        

        return NextResponse.json({user,jwtsign}, { status: 201 });

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
    }
}
