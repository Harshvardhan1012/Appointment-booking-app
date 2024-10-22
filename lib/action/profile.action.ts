'use server';
import { signIn, signOut } from '@/app/auth';
import prisma from '../db';
import { Prisma } from '@prisma/client';
import { registerformschema } from '../validation';
import { z } from 'zod';


export async function createProfile(data: z.infer<typeof registerformschema> & {userId:string}) {
  try {

   const profile= await prisma.$transaction([
      prisma.profile.create({
        data: {
          user: {
            connect: { id: data?.userId }, // Connect the profile to the authenticated user
          },
          name: data.name,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          dob: data.dob,
          Address: data.Address,
          Occupation: data.Occupation,
          InsuranceId: data.InsuranceId,
          InsuranceProvider: data.InsuranceProvider,
          Allergies: data.Allergies,
          CurrentMedications: data.CurrentMedications,
        },
      }),
      
      prisma.user.update({
        where: {
          id: data.userId,
        },
        data: {
          name: data.name,
        },
      }),
    ]);
    
    return { status: 201, profile };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          status: 409,
          error: 'Profile already exists for this user',
        }; // Conflict
      }

      return {
        status: 500,
        error: 'Internal server error',
      };
    } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      return { status: 500, error: 'Network error' };
    } else {
      return { status: 500, error: 'Unexpected error' };
    }
  }
}


export const profilefind = async (userId: string) => {
  try {
    const res = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });
    if (res) {
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error creating user:', e);
    return false;
  }
};

export const handlelogout = async () => {
  try {
    await signOut({
      redirect: false,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const loginwithGoogle = async () => {
  await signIn('google');

  return true;
};
