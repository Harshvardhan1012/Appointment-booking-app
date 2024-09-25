import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Define your secret key (this should be stored securely, e.g., in environment variables)
const SECRET_KEY = process.env.JWT_SECRET || "secret-key"; // Replace with your own secret

// Middleware function to verify the JWT token
export async function middleware(req: NextRequest) {


    console.log("ito the middleware ");
  const token = req.headers.get("authorization")?.split(" ")[1]; // Bearer token
    console.log(token);


  if (!token) {
    return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Decoded token:", decoded);
    // Attach the decoded token (user data) to the request
    console.log("Decoded token:", decoded);
    req.nextUrl.searchParams.set("userId", (decoded as jwt.JwtPayload).id);

    // Allow the request to continue if the token is valid
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
  }
}

// Define the paths that should be protected by this middleware
export const config = {
  matcher: "/api/profile/:path*", // Apply to /api/user and its sub-paths
};
