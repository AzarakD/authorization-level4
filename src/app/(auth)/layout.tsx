import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { getServerAuth } from "@/utils/getServerAuth";
import { PublicRoutes } from "@/constants";

export default async function Layout({ children }: PropsWithChildren<unknown>) {
  const user = await getServerAuth();

  if (user?.isLoggedIn)
    // Redirection by user role example
    // return redirect(user.isAdmin ? AdminRoutes.HOME : PublicRoutes.HOME);
    return redirect(PublicRoutes.HOME);

  return children;
}
