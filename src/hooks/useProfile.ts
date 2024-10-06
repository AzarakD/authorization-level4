import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import authService from "@/services/auth.service";
import { saveAccessToken } from "@/services/cookie.service";
import { transformUserToState } from "@/utils/transformUserToState";

export function useProfile() {
  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    refetchInterval: 1800000, // 30 minutes
  });

  const { isSuccess, data: dataTokens } = useQuery({
    queryKey: ["new tokens"],
    queryFn: () => authService.getNewAccessToken(),
    enabled: !data?.data,
  });

  useEffect(() => {
    if (!isSuccess) return;

    if (dataTokens.data.accessToken)
      saveAccessToken(dataTokens.data.accessToken);
  }, [isSuccess]);

  const profile = data?.data;

  const userState = profile ? transformUserToState(profile) : null;

  return {
    isLoading,

    user: {
      ...profile,
      ...userState,
    },
  };
}
