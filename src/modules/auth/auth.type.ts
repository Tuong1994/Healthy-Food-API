export type TokenPayload = {
  id: string;
  email: string;
  role: number;
  iat?: number;
  exp?: number;
};

export type GooglePayload = {
  email: string;
  name: string;
  googleId: string;
  picture?: string;
  accessToken?: string;
};
