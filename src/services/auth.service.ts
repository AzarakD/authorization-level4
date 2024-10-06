import { axiosPrivate, axiosPublic } from "@/services/axios.service";
import { removeAccessToken, saveAccessToken } from "@/services/cookie.service";
import { IAuthFormData, IUser } from "@/types";

interface IAuthResponse {
  accessToken: string;
  user: IUser;
}

class AuthService {
  async login(data: IAuthFormData) {
    const response = await axiosPublic.post<IAuthResponse>("/auth/login", data);

    if (response.data.accessToken) saveAccessToken(response.data.accessToken);

    return response;
  }

  async register(data: IAuthFormData) {
    const response = await axiosPublic.post<IAuthResponse>(
      "/auth/register",
      data
    );

    if (response.data.accessToken) saveAccessToken(response.data.accessToken);

    return response;
  }

  async getNewAccessToken() {
    const response = await axiosPublic.post<IAuthResponse>(
      "/auth/login/access-token"
    );

    if (response.data.accessToken) saveAccessToken(response.data.accessToken);

    return response;
  }

  async getNewTokensByRefresh(refreshToken: string) {
    const response = await axiosPublic.post<IAuthResponse>(
      "/auth/login/access-token",
      {},
      {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      }
    );

    return response;
  }

  async logout() {
    const response = await axiosPublic.post<boolean>("/auth/logout");

    if (response.data) removeAccessToken();

    return response;
  }

  async getProfile() {
    return axiosPrivate.get<IUser>(`/auth/profile`);
  }
}

export default new AuthService();
