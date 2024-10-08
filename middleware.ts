import { auth } from "./app/auth";
import { NextRequest, NextResponse } from "next/server";
import { profilefind } from "./lib/action/profile.action";

const publicPages = ["/login", "/home", "/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; // Get the current request URL
  console.log("Middleware called00000000000000000000000000000000000000");
  const session = await auth();

  if (session) {
  const allowedPaths = [
    new RegExp(`^/profile/${session?.user?.id}$`), // Match for /profile/[userId]
    /^\/profile\/[^\/]+\/appointment-form\/success\/[^\/]+$/, // Match /profile/[userId]/appointment-form/success/[appointmentId]
    new RegExp(`^/profile/${session?.user?.id}/appointment-form$`), // Allow /profile/[userId]/appointment-form
  ];
  if (publicPages.includes(pathname)) {
    return NextResponse.redirect(
      new URL(`/profile/${session?.user?.id}`, request.url)
    ); // Redirect authenticated users to the dashboard
  }
    const isProfileCreated = await profilefind(Number(session?.user?.id));
    if (isProfileCreated && pathname == `/profile/${session?.user?.id}`) {
      return NextResponse.redirect(
        new URL(`${pathname}/appointment-form`, request.url)
      );
    }
    if (!allowedPaths.some((path) => path.test(pathname))) {
      //page not found redirect
      return NextResponse.redirect(new URL("/not-found", request.url)); // Redirect authenticated users to the dashboard
    }
  }
  if (!session && !publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/not-found", request.url)); // Redirect unauthenticated users to login
  }
 

  return NextResponse.next();
}

// // Configuring the matcher to apply the middleware to specific routes
export const config = {
  matcher: ["/", "/profile/:path*", "/login"],
  // Apply to specific routes
};
