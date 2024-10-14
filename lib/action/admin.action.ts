"use server";
import prisma from "../db";
import { signIn } from "@/app/auth";
import { doctorRegisterSchema } from "../validation";
import { z } from "zod";
import { Prisma } from "@prisma/client/edge";

export const adminRegister=async (user:z.infer<typeof doctorRegisterSchema>) => {
    try {

        const parse=doctorRegisterSchema.safeParse(user);
        if (!parse.success) {
            return {
                status: 400,
                message: "Invalid input",
            }
        }

        const adminUser=await prisma.user.create({
            data: {
                FullName: user.FullName,
                email: user.email,
                password: user.password,
                role: "Admin",
            },
        });
        
            return {
                status: 200,
                message: "success",
                data: adminUser,
            }
        
    } catch (e) { 
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002")
              return {message:"email id already used",status: 409 };
          }
        return {
            status: 500,
            message: "Invalid email or password",
        }
    }
}

export const adminLogin=async (email: string, password: string) => {
    try{
        const signin=await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        if (signin) {
            return true;
        }
        return false;
    }catch(e){
        console.error("Error creating user:", e);
        return false;

    }
}


export const userAdmin=async () => {
    try {
        const user = await prisma.user.findMany({
            where: {
                role: "Admin",
            },
        });

        if(user && user!==null){
        return user.map((name)=>{return {FullName:name.FullName,id:name.id}
        });
        }
        return [];
    } catch (error) {
        console.error("Error finding Admins:", error);
        return false;
    }
}