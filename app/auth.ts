import NextAuth, {
  CredentialsSignin,
  JWT,
  User as NextAuthUser,
} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import prisma from '../lib/db';
import { loginformschema } from '@/lib/validation';
import { Role } from '@prisma/client';
import Google from 'next-auth/providers/google';
import Nodemailer from 'next-auth/providers/nodemailer';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { createTransport } from 'nodemailer';
import { html, text } from '@/components/forms/emailTemplate';

interface User extends NextAuthUser {
  role: string;
  name: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
      name: string;
    };
  }
}

declare module 'next-auth' {
  interface JWT {
    id: string;
    email: string;
    role: Role;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      async sendVerificationRequest(params) {
        const { identifier, provider, theme, url } = params;

        const { host } = new URL(url);

        // console.log(url, "url");
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          from: process.env.EMAIL_FROM,
          subject: `Sign in to Appointment Booking App`,
          text: text({ url, host }),
          html: html({ url, host, theme }),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email (${failed.join(', ')}) could not be sent`);
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          code_challenge_method: 'S256', // PKCE flow
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials || !credentials.email || !credentials.password)
            return null;

          const validate = loginformschema.safeParse(credentials);
          if (!validate.success) {
            throw new CredentialsSignin({ status: 401 });
          }
          const user = await prisma.user.findUnique({
            where: {
              email: validate.data.email,
              // password: validate.data.password,
            },
          });
          console.log(user, 'user');
          if (!user) {
            throw new CredentialsSignin({ status: 401 });
          }

          const User: User = {
            id: user.id.toString(),
            email: user.email,
            role: user.role,
            name: user.name as string,
          };
          return User;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  basePath: '/api/auth',
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/not-found',
  },

  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        const typedUser = user as JWT; // Type cast user to User
        const userfind = await prisma.user.findUnique({
          where: {
            email: user.email as string,
          },
        });
        if (!userfind) {
          const usercreate = await prisma.user.create({
            data: {
              email: user.email as string,
              role: typedUser.role ?? 'User',
              name: user.name as string,
              // password:""
            },
          });
          return {
            id: usercreate.id,
            name: usercreate.name,
            email: usercreate.email,
            image: user.image,
            role: 'User',
          };
        }
        await prisma.verificationToken.deleteMany({
          where: { identifier: user.email as string },
        });
        return {
          id: userfind.id,
          email: userfind.email,
          name: userfind.name,
          image: user.image,
          role: userfind.role ?? 'User',
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email as string;
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.name = token.name as string;
      }
      return session;
    },
    async signIn({ account, profile }) {
      console.log(account, profile, 'account,profile');
      if (profile?.email_verified && account?.provider === 'google') {
        return true;
      } else {
        if (
          account?.provider === 'email' ||
          account?.provider === 'nodemailer'
        ) {
          return true;
        }
      }
      return false;
    },
  },
  trustHost: true,
});
