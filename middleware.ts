import { NextRequest, NextResponse } from 'next/server';
import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { decode } from 'next-auth/jwt';
import { cookies } from 'next/headers';

const publicPages = ['/login', '/home', '/', '/admin/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookiesget = cookies().get('__Secure-authjs.session-token');
  const session = await decodeSessionCookie(cookiesget!);

  if (session) {
    const allowedPaths = [
      new RegExp(`^/admin/${session?.id}$`), // Match for /profile/[userId]
      new RegExp(`^/profile/${session?.id}$`), // Match for /profile/[userId]
      /^\/profile\/[^\/]+\/appointment-form\/success\/[^\/]+$/, // Match /profile/[userId]/appointment-form/success/[appointmentId]
      new RegExp(`^/profile/${session?.id}/appointment-form$`), // Allow /profile/[userId]/appointment-form
      new RegExp(`^/profile/${session?.id}/manage`), // Allow /profile/[userId]/appointment-form/[appointmentId]
    ];

    if (session?.role == 'Admin' && pathname !== `/admin/${session?.id}`) {
      return NextResponse.redirect(
        new URL(`/admin/${session?.id}`, request.url)
      );
    }

    if (publicPages.includes(pathname)) {
      return NextResponse.redirect(
        new URL(`/profile/${session?.id}`, request.url)
      ); 
    }
    if (!allowedPaths.some((path) => path.test(pathname))) {
      return NextResponse.redirect(new URL('/not-found', request.url));
    }
  }

  if (!cookiesget && !publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/login',
    '/admin/:path*',
    '/admin/register',
  ],
  // Apply to specific routes
};

async function decodeSessionCookie(cookie: RequestCookie) {
  try {
    const cookies = await decode({
      token: cookie.value,
      secret: process.env.AUTH_SECRET as string,
      salt: cookie.name,
    });
    return cookies;
  } catch (error) {
    return null;
  }
}
