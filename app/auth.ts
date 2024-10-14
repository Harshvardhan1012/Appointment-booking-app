// "use server"
import NextAuth, { CredentialsSignin, JWT, User as NextAuthUser } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../lib/db";
import { loginformschema } from "@/lib/validation";
import { Role } from "@prisma/client";

interface User extends NextAuthUser {
  role: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
   
    };
  }
}

declare module "next-auth" {
  interface JWT {
    id: string;
    email: string;
    role: Role;
   
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {label:"email", type: "email" },
        password: {label:"password", type: "password" },
      },
       async authorize(credentials) {
        try {
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
          console.log(user, "user");
          if (!user) {
            throw new CredentialsSignin({ status: 401 });
          }
      
         
          const User: User = {
            id: user.id.toString(),
            email: user.email,
            role: user.role,
          };
          return User;  
        } catch (err) {
          console.log(err);
          return null;  
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
        const typedUser = user as JWT; // Type cast user to User
        return {
          ...token,
          id: typedUser.id,
          email: typedUser.email,
          role: typedUser.role,
        };
      }
      return token;
    },
    async session({ session, token }) {
     if (token) {
       session.user.email=token.email as string;
        session.user.id = token.id as string;
        session.user.role=token.role as Role;
      }
      return session;
    }
  },
  trustHost: true
});
