import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./app/auth";

export async function middleware(request: NextRequest) {

   const session=await auth();
   const response = NextResponse.next();
   response.headers.set('Cache-Control', 'no-store');
    // If user is not authenticated, redirect to login page
    const { pathname } = request.nextUrl;  // Get the current request URL
    console.log("middleware called-=029000",session);

    if (session && (pathname === '/login' || pathname === '/home')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));  // Redirect to dashboard
    }

    return NextResponse.next();
  }
  
  export const config = {
    matcher: [ '/login', '/dashboard','/','/home'],  // Apply to specific routes
};