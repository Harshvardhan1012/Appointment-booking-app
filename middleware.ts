import { auth } from "./app/auth";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; // Get the current request URL
  console.log(request.url);
  console.log(
    "Middleware called00000000000000000000000000000000000000",
  );
  const session = await auth();
  console.log("session", session);
  const userId = pathname.split("/")[2];
  console.log("userId", userId);
  const publicPages = ["/login", "/home","/"];
  
  const allowedPaths = [
    /^\/$/,
    /^\/login$/,                                   // Exact match for /login
    new RegExp(`^/profile/${session?.user?.id}$`),            // Match for /profile/[userId]
    /^\/profile\/[^\/]+\/appointment-form\/success\/[^\/]+$/,  // Match /profile/[userId]/appointment-form/success/[appointmentId]
    new RegExp(`^/profile/${userId}/appointment-form$`),    // Allow /profile/[userId]/appointment-form
  ];
 
    if (!allowedPaths.some((path) => path.test(pathname))) {
      //page not found redirect
      return NextResponse.redirect(new URL("/not-found", request.url)); // Redirect authenticated users to the dashboard
    }
  
  // }
  // //   List of pages that don't require authentication

  // //   // If no session and trying to access protected routes (like dashboard or appointment form), redirect to login
  if (!session && !publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url)); // Redirect unauthenticated users to login
  }
  // //   If user is authenticated and trying to access public pages like login or home, redirect to dashboard
  if (session && publicPages.includes(pathname)) {
    return NextResponse.redirect(
      new URL(`/profile/${session?.user?.id}`, request.url)
    ); // Redirect authenticated users to the dashboard
  }


  // //   If the session is valid or the route is public, allow the request to continue
  //   return NextResponse.next();  // Proceed to the requested page
}

// // Configuring the matcher to apply the middleware to specific routes
export const config = {
  matcher: ["/", "/profile/:path*", "/login"],
  // Apply to specific routes
};
