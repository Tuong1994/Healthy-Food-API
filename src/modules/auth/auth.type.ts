export type TokenPayload = {
  id: string;
  email: string;
  role: number;
  iat?: number;
  exp?: number;
};
