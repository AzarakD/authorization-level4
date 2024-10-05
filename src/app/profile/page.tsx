import { cookies } from "next/headers";

import { API_URL, EnumTokens } from "@/constants";
import { IUser } from "@/types";

// server action
const fetchProfile = async () => {
  "use server";

  const cookie = cookies();
  const accessToken = cookie.get(EnumTokens.ACCESS_TOKEN)?.value;

  // Next JS recommends using fetch on edge
  return fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json()) as Promise<IUser>;
};

export default async function ProfilePage() {
  const profile = await fetchProfile();

  return (
    <div>
      {profile ? (
        <>
          <h1>Profile</h1>
          <p>{profile.email}</p>
        </>
      ) : (
        <p>Not found!</p>
      )}
    </div>
  );
}
