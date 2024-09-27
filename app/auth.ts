// "use server"
import NextAuth from "next-auth"
import  Credentials  from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "../lib/db"
import { User } from "@prisma/client"



export const { auth, handlers, signIn, signOut } =NextAuth({
adapter: PrismaAdapter(prisma),
  providers: [

  Credentials({
    name:"Credentials",
    credentials:{
      password:{label:"Username",type:"text"},
      email:{label:"Email",type:"email"},
    },
    authorize:async(credentials:User)=>{
      const { password,email } = credentials;

      try{

        console.log("inside auth function");
      const user = await prisma.user.findUnique({
        where:{
          password,
          email
        }
      })

      if (!user || user.password !== password) {
        console.log("Invalid credentials");
        throw new Error("Invalid email or password");  // Throw a custom error message
      }
      console.log(user);


      if (user) {
        return user;
      }
      return null;

    }catch(err){
      console.log(err,"error");
    }
    }
}),
] ,      
  session:{
   strategy:"jwt",    
  },
  pages:{
    signIn:"/login",
  },

})