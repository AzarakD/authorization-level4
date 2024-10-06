import { UserRole } from "@/constants";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface IAuthFormData extends Pick<IUser, "email"> {
  password: string;
}

export interface ITokenData {
  id: number;
  role: UserRole;
  iat: number;
  exp: number;
}

export type TProtectUserData = Omit<ITokenData, "iat" | "exp">;
