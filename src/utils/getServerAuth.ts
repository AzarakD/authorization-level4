"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";

import authService from "@/services/auth.service";
import { EnumTokens } from "@/constants";
import { ITokenData } from "@/types";
import { TUserDataState, transformUserToState } from "./transformUserToState";

// TODO. Move it to middleware
export async function getServerAuth(): Promise<TUserDataState | null> {
  const JWT_SECRET = process.env.JWT_SECRET;
  let accessToken = cookies().get(EnumTokens.ACCESS_TOKEN)?.value;
  const refreshToken = cookies().get(EnumTokens.REFRESH_TOKEN)?.value;

  if (!refreshToken) return null;

  if (!accessToken) {
    try {
      const { data } = await authService.getNewTokensByRefresh(refreshToken);
      accessToken = data.accessToken;
    } catch (error) {
      return null;
    }
  }

  try {
    const { payload }: { payload: ITokenData } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(`${JWT_SECRET}`)
    );

    if (!payload) return null;

    return transformUserToState(payload);
  } catch (error) {
    return null;
  }
}
