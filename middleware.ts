import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./app/auth";

export async function middleware(request: NextRequest) {

   const session=await auth();
    // If user is not authenticated, redirect to login page
    if (!session) {
      
      return NextResponse.redirect(new URL('/login', request.url));
    }
  
    // If user is authenticated, continue
    return NextResponse.next();
  }
  
  export const config = {
    matcher: ['/dashboard'], // Protect specific routes (adjust as necessary)
};