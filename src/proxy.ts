import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface JWTPayload {
  id: string;
  name: string;
  scope: string;
  exp: number;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const secretString = process.env.JWT_SECRET;

  if (!secretString) {
    console.error(
      "Configuration Error: JWT_SECRET environment variable missing from server context.",
    );
    return NextResponse.next();
  }

  let payload: JWTPayload | null = null;

  if (token) {
    try {
      const secretKey = new TextEncoder().encode(secretString);
      const { payload: verifiedPayload } = await jwtVerify(token, secretKey);

      payload = verifiedPayload as unknown as JWTPayload;
    } catch (error) {
      console.warn(
        "Security warning: JWT token verification failed or expired.",
      );
    }
  }

  const isAuthorisedAdmin = payload !== null && payload.scope === "admin";

  if (pathname === "/login") {
    if (isAuthorisedAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthorisedAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (internal API endpoints)
     * - _next/static (static compiled files)
     * - _next/image (image optimisation queries)
     * - favicon.ico (site icon)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
