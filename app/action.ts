'use server';

import { cookies } from 'next/headers';

export async function deleteee() {
  cookies().delete('auth-js.session-token');
  return {
    status: 200,
    body: 'success',
  };
}
