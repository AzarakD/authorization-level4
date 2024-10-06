export const API_URL = "http://localhost:4200/api";
export const IS_CLIENT = typeof window !== "undefined";

export enum EnumTokens {
  "ACCESS_TOKEN" = "accessToken",
  "REFRESH_TOKEN" = "refreshToken",
}

export enum PublicRoutes {
  "HOME" = "/",
  "LOGIN" = "/login",
}

export enum AdminRoutes {
  "HOME" = "/admin",
}

export enum UserRole {
  "User" = "USER",
  "Admin" = "ADMIN",
}
