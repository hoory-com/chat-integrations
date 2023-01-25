export enum ErrorCodes {
  EMAIL_EXISTS = "EMAIL_EXISTS",
  UNDETERMINED_ERROR = "UNDETERMINED_ERROR",
}

export const unAuthCategories = [
  "Unauthenticated.",
  "authorization",
  "authentication",
];

export type User = {
  id: number;
  email: string;
  name: string;
  firstName: string;
  createdAt: string;
  isTester: boolean;
  jwtToken?: string;
  updatedAt: string;
  billingDetails: [any];
};

type Token = {
  access_token: string;
  token_type: string;
};

export type SignupResponse = {
  data?: {
    user?: User;
    token?: Token;
  };
  message?: string;
};

export interface Error {
  name: string;
  message: string;
  stack?: string;
  category?: string;
}

export type ServerError = {
  [kay: string]: string;
};

export type FieldsData = {
  name: string;
  errors: string[];
};
