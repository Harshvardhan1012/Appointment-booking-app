// "use server"
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../lib/db";
import { User } from "@prisma/client";
import { stat } from "fs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        password: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
      },
      authorize: async (credentials:{email:string,password:string}) => {

        
        try {
          const { password, email } = credentials;
          console.log("inside auth function");
          const user = await prisma.user.findUnique({
            where: {
              password,
              email,
            },
          });

          console.log(user);
          

          if (!user) {
           throw new CredentialsSignin({status:401});
            
          }
          
          if (!user.password) {
            throw new CredentialsSignin({status:401});
 
           }

          console.log("user found");

          return user;
        } catch (err) {
          console.log(err, "error");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
},
});
