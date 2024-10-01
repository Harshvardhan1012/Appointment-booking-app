// export { auth as middleware } from "./app/auth";
// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "./app/auth";

export async function middleware() {
// //   Call the auth function to check for the user session
// console.log("Middleware running for:", request.nextUrl.pathname);
//   const session = await auth();  // Assume auth() checks the session or authentication token
// //   const { pathname } = request.nextUrl;  // Get the current request URL

  console.log("Middleware called00000000000000000000000000000000000000");

// //   List of pages that don't require authentication
// //   const publicPages = ['/login', '/home'];

// //   If user is authenticated and trying to access public pages like login or home, redirect to dashboard
// //   if (session && publicPages.includes(pathname)) {
// //     return NextResponse.redirect(new URL('/dashboard', request.url));  // Redirect authenticated users to the dashboard
// //   }

// //   // If no session and trying to access protected routes (like dashboard or appointment form), redirect to login
// //   if (!session && !publicPages.includes(pathname)) {
// //     return NextResponse.redirect(new URL('/login', request.url));  // Redirect unauthenticated users to login
// //   }

// //   If the session is valid or the route is public, allow the request to continue
//   return NextResponse.next();  // Proceed to the requested page
}

// // Configuring the matcher to apply the middleware to specific routes
export const config = {
  matcher:[ '/', '/profile/:path*'],  // Apply to specific routes
};
