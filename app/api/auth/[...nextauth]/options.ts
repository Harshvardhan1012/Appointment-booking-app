"use server"
import prisma from "@/lib/db"
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"


export const {handlers,signIn,signOut}= NextAuth({
providers: [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      name: { label: "name", type: "text" },
      email: { label: "Email", type: "email" },
      phone: { label: "Phone", type: "number" }
    },


    async authorize(credentials: Record<"name" | "email" | "phone", string> | undefined): Promise<any> {
      if (!credentials) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: {
          name: credentials.name,
          email: credentials.email, // Assuming email is used as username
          phone: credentials.phone  // Assuming phone is used as username
        }
      });

      if (user) {
        return user;
      } else {
        return null;
      }
    }
  })
],
pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
},
  callbacks: {

    jwt({ token, user, trigger, session }) {
        if (user) {
            token.id = user.id as string;
        }
        if (trigger === "update" && session) {
            token = { ...token, ...session };
        }
        return token;
    },
   
},

},
)



