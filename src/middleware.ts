import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { AdminRoutes, EnumTokens, PublicRoutes, UserRole } from "./constants";
import authService from "./services/auth.service";
import { ITokenData } from "./types";

const redirectToLogin = (isAdminPage: boolean, request: NextRequest) => {
  return NextResponse.redirect(
    // We show 404 in order not to expose admin page route
    new URL(isAdminPage ? "/404" : PublicRoutes.LOGIN, request.url)
  );
};

export async function middleware(request: NextRequest, response: NextResponse) {
  const refreshToken = request.cookies.get(EnumTokens.REFRESH_TOKEN)?.value;
  let accessToken = request.cookies.get(EnumTokens.ACCESS_TOKEN)?.value;

  const isAdminPage = request.url.includes(AdminRoutes.HOME);

  if (!refreshToken) {
    request.cookies.delete(EnumTokens.ACCESS_TOKEN);
    return redirectToLogin(isAdminPage, request);
  }

  if (!accessToken) {
    try {
      const { data } = await authService.getNewTokensByRefresh(refreshToken);
      accessToken = data.accessToken;
    } catch (error) {
      console.log(error);

      request.cookies.delete(EnumTokens.ACCESS_TOKEN);
      return redirectToLogin(isAdminPage, request);
    }
  }

  try {
    const { payload }: { payload: ITokenData } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(`${process.env.JWT_SECRET}`)
    );

    if (payload?.role === UserRole.Admin) return NextResponse.next();

    if (isAdminPage) {
      return NextResponse.redirect(new URL("/404", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("exp claim timestamp check failed")
    ) {
      console.log(error.message);
      return redirectToLogin(isAdminPage, request);
    }

    console.log(error);
    return redirectToLogin(isAdminPage, request);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};
