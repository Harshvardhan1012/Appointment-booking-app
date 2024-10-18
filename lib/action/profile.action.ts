"use server";
import {  signIn, signOut } from "@/app/auth";
import prisma from "../db";

export const profilefind = async (userId: string) => {
  try {
    const res = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });
    if (res) {
      return true
    }
    return false;
  } catch (e) {
    console.error("Error creating user:", e);
    return false;
  }
};

export const handlelogout=async()=>{
    try{
     
        await signOut({
            redirect: false,
        })
        return true;
    }
    catch(err){
      console.log(err);
      return false;
        
    }
    
}

export const loginwithGoogle = async () => {
  
    await signIn("google");
    
    return true;
  
}
