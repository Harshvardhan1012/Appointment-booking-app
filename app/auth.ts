// "use server"
import NextAuth, { CredentialsSignin, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../lib/db";
import { loginformschema } from "@/lib/validation";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {label:"email", type: "email" },
        password: {label:"password", type: "password" },
      },
       async authorize(credentials) {
        try {
          console.log(credentials, "credentials");
          if (!credentials || !credentials.email || !credentials.password) return null;
      
          const validate = loginformschema.safeParse(credentials);
          if (!validate.success) {
            throw new CredentialsSignin({ status: 401 });
          }
      
          const user = await prisma.user.findUnique({
            where: {
              email: validate.data.email,
              password: validate.data.password,
            },
          });
      
          if (!user) {
            throw new CredentialsSignin({ status: 401 });
          }
      
          // Map the Prisma user to the NextAuth User type (adjust this based on what NextAuth expects)
         
          const User: User = {
            id: user.id.toString(),
            email: user.email,
          };
          return User;  // Return a type compatible with NextAuth User
        } catch (err) {
          console.log(err, "error");
          return null;  // Ensure null is returned on error, not undefined
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.sub,
          email: token.email,
        },
      };
    },
  },
  trustHost: true
});
