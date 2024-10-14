import { auth } from "./app/auth";
import { NextRequest, NextResponse } from "next/server";
import { profilefind } from "./lib/action/profile.action";

const publicPages = ["/login", "/home", "/","/admin/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; // Get the current request URL
  console.log("Middleware called00000000000000000000000000000000000000");
  const session = await auth();
  console.log(session?.user, "session");
  if (session) {
  const allowedPaths = [
    new RegExp(`^/admin/${session?.user?.id}$`), // Match for /profile/[userId]
    new RegExp(`^/profile/${session?.user?.id}$`), // Match for /profile/[userId]
    /^\/profile\/[^\/]+\/appointment-form\/success\/[^\/]+$/, // Match /profile/[userId]/appointment-form/success/[appointmentId]
    new RegExp(`^/profile/${session?.user?.id}/appointment-form$`), // Allow /profile/[userId]/appointment-form
  ];


  if(session?.user?.role=='Admin' && pathname !== `/admin/${session?.user?.id}` ){
    console.log("redirecting to admin");
    return NextResponse.redirect(
      new URL(`/admin/${session?.user?.id}`, request.url)
    );
  }
  const isProfileCreated = await profilefind(Number(session?.user?.id));
  if (isProfileCreated && pathname == `/profile/${session?.user?.id}`) {
    return NextResponse.redirect(
      new URL(`${pathname}/appointment-form`, request.url)
    );
  }
  if (!isProfileCreated && pathname == `/profile/${session?.user?.id}/appointment-form`) {
    console.log("Redirecting to profile 11111");
    return NextResponse.redirect(
      new URL(`/profile/${session?.user?.id}`, request.url)
    );
  }
  if (publicPages.includes(pathname)) {
    console.log("Redirecting to profile 22222");
    return NextResponse.redirect(
      new URL(`/profile/${session?.user?.id}`, request.url)
    ); // Redirect authenticated users to the dashboard
  }
    if (!allowedPaths.some((path) => path.test(pathname))) {
      console.log("Redirecting to profile 333333");
      return NextResponse.redirect(new URL("/not-found", request.url)); 
    }
  }

  if (!session && !publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/not-found", request.url)); 
  }
 

  return NextResponse.next();
}

// // Configuring the matcher to apply the middleware to specific routes
export const config = {
  matcher: ["/", "/profile/:path*", "/login","/admin/:path*","/admin/register"],
  // Apply to specific routes
};
