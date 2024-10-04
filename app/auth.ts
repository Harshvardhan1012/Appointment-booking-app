// "use server"
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../lib/db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        password: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
      },
      authorize: async (credentials: { email: string; password: string }) => {
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
            throw new CredentialsSignin({ status: 401 });
          }

          if (!user.password) {
            throw new CredentialsSignin({ status: 401 });
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
    async signIn({ user, account, profile, email, credentials }) {
     console.log("signin", user, account, profile, email, credentials);
     return true;
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
});
