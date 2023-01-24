import axios, { AxiosError } from "axios";
import { TEMPLATE_URL, UC_X_API_KEY } from "./constants";

type ServerError = {
  [kay: string]: string;
};

type FieldsData = {
  name: string;
  errors: string[];
};

export const getFieldsDataFromServerError = (errors: ServerError[]) => {
  const error = Object.keys(errors).reduce(
    (acc: any[], key: string) => [...acc, { name: key, errors: errors[key] }],
    []
  );

  return error as FieldsData[];
};

export const errorsHandler = (error: AxiosError) => {
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
};

// Template api
const axiosAiApi = axios.create({
  baseURL: TEMPLATE_URL,
});

axiosAiApi.interceptors.request.use((config) => {
  const headers: { [key: string]: string } = {
    "UC-X-API-KEY": UC_X_API_KEY,
  };

  Object.assign(config.headers || {}, headers);

  return config;
});

axiosAiApi.interceptors.response.use((response) => response, errorsHandler);
// Template api End/

export default axiosAiApi;
