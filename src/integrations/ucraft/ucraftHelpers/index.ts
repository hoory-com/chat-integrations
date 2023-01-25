import axiosSsoApi, { registerAuthToken } from "./axiosSsoApi";
import { ErrorCodes, SignupResponse } from "./types";
import { AUTH_TOKEN_KEY, SSO_URL } from "./constants";

export const ssoServices = {
  signup(data: { name: string; email: string }) {
    return axiosSsoApi
      .post<typeof data, SignupResponse>(`/api/register-by-email`, data)
      .then((result: any) => {
        const token = result?.data?.token?.access_token;
        const user = result?.data?.user;

        if (token && user) {
          registerAuthToken(token);
          localStorage.setItem(AUTH_TOKEN_KEY, token);

          return { user: user };
        }

        if (result?.message) {
          return { message: result.message };
        }

        return { message: ErrorCodes.UNDETERMINED_ERROR };
      });
  },
};

export const redirectToDashboard = (projectId: string) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  return `${SSO_URL}/callback?projectId=${projectId}&target=dashboard&token=${token}`;
};

export const getUcraftAuthToken = () =>
  localStorage.getItem(AUTH_TOKEN_KEY) || "";
