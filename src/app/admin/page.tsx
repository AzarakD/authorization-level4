import { cookies } from "next/headers";
import type { Metadata } from "next";

import { API_URL, EnumTokens } from "@/constants";
import { IUser } from "@/types";

export const metadata: Metadata = {
  title: "Admin SSR",
};

const fetchUser = async () => {
  "use server";

  const cookie = cookies();
  const accessToken = cookie.get(EnumTokens.ACCESS_TOKEN)?.value;

  return fetch(`${API_URL}/auth/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json()) as Promise<IUser[]>;
};

export default async function AdminPage() {
  const users = await fetchUser();

  return (
    <div>
      {users?.length ? (
        users.map((user) => <div key={user.id}>{user.email}</div>)
      ) : (
        <p>Not found!</p>
      )}
    </div>
  );
}
