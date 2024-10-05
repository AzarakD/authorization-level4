import axios, { CreateAxiosDefaults } from "axios";

import { errorCatch, getContentType } from "@/utils/axios.helper";
import { getAccessToken, removeAccessToken } from "@/services/cookie.service";
import authService from "@/services/auth.service";
import { API_URL } from "@/constants";

const axiosOptions: CreateAxiosDefaults = {
  baseURL: API_URL,
  headers: getContentType(),
  withCredentials: true,
};

export const axiosPublic = axios.create(axiosOptions);
export const axiosPrivate = axios.create(axiosOptions);

axiosPrivate.interceptors.request.use((reqConfig) => {
  const accessToken = getAccessToken();

  if (reqConfig?.headers && accessToken) {
    reqConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  return reqConfig;
});

axiosPrivate.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error?.response?.status === 401 ||
        errorCatch(error) === "jwt expired" ||
        errorCatch(error) === "jwt must be provided") &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;

      try {
        await authService.getNewAccessToken();

        return axiosPrivate.request(originalRequest);
      } catch (error) {
        if (
          errorCatch(error) === "jwt expired" ||
          errorCatch(error) === "Refresh token not passed"
        )
          removeAccessToken();
      }
    }
  }
);
