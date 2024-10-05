import { NextRequest, NextResponse } from "next/server";
import { EnumTokens } from "./constants";

export async function middleware(request: NextRequest, response: NextResponse) {
  const refreshToken = request.cookies.get(EnumTokens.REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
