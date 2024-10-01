'use server'
 
import { cookies } from 'next/headers'
 
export async function deleteee() {
  cookies().delete('auth-js.session-token');
  console.log("deleted");
  return {
    status: 200,
    body: 'success',
  }
}