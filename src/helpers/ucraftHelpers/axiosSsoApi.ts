import axios, { AxiosError } from "axios";
import { SSO_URL, AUTH_TOKEN_KEY } from "./constants";
import { ServerError, FieldsData } from "./types";

const axiosSsoApi = axios.create({
  withCredentials: true,
  baseURL: SSO_URL,
});

const AUTH_TOKEN = localStorage.getItem(AUTH_TOKEN_KEY) || "";
if (AUTH_TOKEN) {
  registerAuthToken(AUTH_TOKEN);
}

export function getAuthorizationHeader() {
  return `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`;
}

export function registerAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  axiosSsoApi.interceptors.request.use((config) => {
    if (config?.headers) {
      config.headers.Authorization = getAuthorizationHeader();
    }

    return config;
  });
}

export const getFieldsDataFromServerError = (errors: ServerError[]) => {
  const error = Object.keys(errors).reduce(
    (acc: any[], key: string) => [...acc, { name: key, errors: errors[key] }],
    []
  );

  return error as unknown as FieldsData[];
};

axiosSsoApi.interceptors.request.use((config) => {
  const headers: { [key: string]: string } = {
    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY)}`,
  };

  Object.assign(config.headers || {}, headers);

  return config;
});

axiosSsoApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { response } = error;
    const errorData = response?.data;

    return new Promise((_, reject) => {
      if (errorData) {
        if (errorData.errors) {
          const errors = getFieldsDataFromServerError(errorData.errors);
          return reject({ ...errorData, errors });
        }

        return reject(errorData);
      }

      return reject(error);
    });
  }
);

export default axiosSsoApi;
