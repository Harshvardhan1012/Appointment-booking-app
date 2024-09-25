import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    const a=await prisma.user.findUnique({
        where:{
            id:4
        }
    });

    if(a){
    return NextResponse.json(a);
    }
    else{
        return NextResponse.json({message:"not found"});
    }
    
}
