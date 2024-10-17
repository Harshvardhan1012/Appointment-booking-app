import { NextRequest, NextResponse } from "next/server";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

const publicPages = ["/login", "/home", "/","/admin/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; // Get the current request URL
  const baseUrl = request.nextUrl.origin; // Gets the base URL from the request
  const cookiesget = cookies().get("__Secureauthjs.session-token");

  console.log(cookiesget,"token34324344324324");
  if(cookiesget){
    const session=await decodeSessionCookie(cookiesget);

  console.log(session,"token34324344324324");

  if(session){
const allowedPaths = [
    new RegExp(`^/admin/${session?.id}$`), // Match for /profile/[userId]
    new RegExp(`^/profile/${session?.id}$`), // Match for /profile/[userId]
    /^\/profile\/[^\/]+\/appointment-form\/success\/[^\/]+$/, // Match /profile/[userId]/appointment-form/success/[appointmentId]
    new RegExp(`^/profile/${session?.id}/appointment-form$`), // Allow /profile/[userId]/appointment-form
  ];


  if(session?.role=='Admin' && pathname !== `/admin/${session?.id}` ){
    console.log("redirecting to admin");
    return NextResponse.redirect(
      new URL(`/admin/${session?.id}`, request.url)
    );
  }
  
  const isProfileCreated = await fetch(`${baseUrl}/api/auth/profilefind`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: session?.id }),
  });


  console.log(isProfileCreated.ok,"isProfileCreated");
  
  if (isProfileCreated.ok && pathname == `/profile/${session?.id}`) {
    return NextResponse.redirect(
      new URL(`${pathname}/appointment-form`, request.url)
    );
  }
  if (!isProfileCreated.ok && pathname == `/profile/${session?.id}/appointment-form`) {
    console.log("Redirecting to profile 11111");
    return NextResponse.redirect(
      new URL(`/profile/${session?.id}`, request.url)
    );
  }
  if (publicPages.includes(pathname)) {
    console.log("Redirecting to profile 22222");
    return NextResponse.redirect(
      new URL(`/profile/${session?.id}`, request.url)
    ); // Redirect authenticated users to the dashboard
  }
    if (!allowedPaths.some((path) => path.test(pathname))) {
      console.log("Redirecting to profile 333333");
      return NextResponse.redirect(new URL("/not-found", request.url)); 
    }
  }
  }

  if (!cookiesget && !publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/not-found", request.url)); 
  }
 

  return NextResponse.next();
}



export const config = {
  matcher: ["/", "/profile/:path*", "/login","/admin/:path*","/admin/register"],
  // Apply to specific routes
};


async function decodeSessionCookie(cookie:RequestCookie) {
  // Your logic to decode or verify the cookie (e.g., JWT, base64, etc.)
  try {
    // Assuming it's a JWT token
    const cookies=await decode({
      token: cookie.value,
      secret: process.env.AUTH_SECRET as string,
      salt:cookie.name,
    });
    return cookies;
  } catch (error) {
    return null;
  }
}


// import withAuth  from "next-auth/middleware"

// export default withAuth(
//   // `withAuth` augments your `Request` with the user's token.
//   function middleware(req) {
//     console.log(req.nextauth.token)
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => token?.role === "admin",
//     },
//   },
// )

// export const config = { matcher: ["/admin"] }
